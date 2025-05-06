// BuildCo Scope of Works Generator - Table Module

// Table handling functionality
const TableHandler = {
    // Initialize table functionality
    initializeTable: function() {
        // Add row button
        document.querySelector('.btn-add-row').addEventListener('click', this.addRow);
        
        // Clear table button
        document.querySelector('.btn-clear-table').addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all items from the table?')) {
                const tbody = document.querySelector('#schedule-table tbody');
                while (tbody.children.length > 1) {
                    tbody.removeChild(tbody.lastChild);
                }
                
                // Clear first row
                const firstRow = tbody.firstChild;
                firstRow.querySelector('.description').value = '';
                firstRow.querySelector('.unit').value = '';
                firstRow.querySelector('.quantity').value = '';
                firstRow.querySelector('.rate').value = '';
                firstRow.querySelector('.amount').textContent = '$0.00';
                
                // Update total
                TableHandler.updateTotal();
            }
        });
        
        // Sort table button
        document.querySelector('.btn-sort-table').addEventListener('click', function() {
            const tbody = document.querySelector('#schedule-table tbody');
            const rows = Array.from(tbody.rows);
            
            // Remove all rows
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            
            // Add sorted rows back
            rows.forEach(row => tbody.appendChild(row));
            
            // Renumber rows
            TableHandler.updateRowNumbers();
        });
        
        // Initial row setup
        const initialRow = document.querySelector('#schedule-table tbody tr');
        const quantityInput = initialRow.querySelector('.quantity');
        const rateInput = initialRow.querySelector('.rate');
        
        quantityInput.addEventListener('input', function() {
            TableHandler.calculateRowTotal(this);
        });
        
        rateInput.addEventListener('input', function() {
            TableHandler.calculateRowTotal(this);
        });
        
        const deleteButton = initialRow.querySelector('.btn-delete');
        deleteButton.addEventListener('click', function() {
            TableHandler.deleteRow(this);
        });
        
        // Initialize drag and drop for table rows
        if (typeof Sortable !== 'undefined') {
            Sortable.create(document.querySelector('#schedule-table tbody'), {
                handle: '.btn-move',
                animation: 150,
                onEnd: () => {
                    // Renumber rows after dragging
                    TableHandler.updateRowNumbers();
                }
            });
        }
        
        // CSV import/export functionality
        document.querySelector('.btn-import-csv').addEventListener('click', function() {
            document.getElementById('import-dialog').style.display = 'block';
        });
        
        document.querySelector('.btn-export-csv').addEventListener('click', function() {
            TableHandler.exportTableToCSV('schedule_of_rates.csv');
        });
        
        // CSV file input handling
        document.getElementById('csv-file-input').addEventListener('change', function() {
            const fileName = this.files[0]?.name || 'No file selected';
            document.getElementById('file-name').textContent = fileName;
        });
        
        // Import dialog buttons
        document.getElementById('btn-cancel-import').addEventListener('click', function() {
            document.getElementById('import-dialog').style.display = 'none';
        });
        
        document.querySelector('.modal-close').addEventListener('click', function() {
            document.getElementById('import-dialog').style.display = 'none';
        });
        
        document.getElementById('btn-confirm-import').addEventListener('click', function() {
            const fileInput = document.getElementById('csv-file-input');
            if (fileInput.files.length > 0) {
                const hasHeaderRow = document.getElementById('has-header-row').checked;
                const clearExistingData = document.getElementById('clear-existing-data').checked;
                
                TableHandler.importCSV(fileInput.files[0], hasHeaderRow, clearExistingData);
                document.getElementById('import-dialog').style.display = 'none';
            } else {
                Utilities.showToast('Please select a CSV file', 'error');
            }
        });
    },
    
    // Add row to schedule table
    addRow: function() {
        const tbody = document.querySelector('#schedule-table tbody');
        const rowCount = tbody.rows.length;
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${rowCount + 1}</td>
            <td><input type="text" class="description" placeholder="Enter description"></td>
            <td><input type="text" class="unit" placeholder="e.g., ea"></td>
            <td><input type="number" class="quantity" min="0" step="0.01"></td>
            <td><input type="number" class="rate" min="0" step="0.01"></td>
            <td class="amount">$0.00</td>
            <td class="no-print">
                <button type="button" class="btn btn-sm btn-icon btn-delete" aria-label="Delete row">
                    <i class="fas fa-trash"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon btn-move" aria-label="Move row">
                    <i class="fas fa-grip-lines"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(newRow);
        
        // Add event listeners for the new row
        const quantityInput = newRow.querySelector('.quantity');
        const rateInput = newRow.querySelector('.rate');
        
        quantityInput.addEventListener('input', function() {
            TableHandler.calculateRowTotal(this);
        });
        
        rateInput.addEventListener('input', function() {
            TableHandler.calculateRowTotal(this);
        });
        
        const deleteButton = newRow.querySelector('.btn-delete');
        deleteButton.addEventListener('click', function() {
            TableHandler.deleteRow(this);
        });
        
        // Focus on the description field of the new row
        newRow.querySelector('.description').focus();
    },
    
    // Delete row from schedule table
    deleteRow: function(button) {
        const row = button.closest('tr');
        row.remove();
        
        // Renumber remaining rows
        TableHandler.updateRowNumbers();
        
        // Update total
        TableHandler.updateTotal();
    },
    
    // Update row numbers
    updateRowNumbers: function() {
        const rows = document.querySelectorAll('#schedule-table tbody tr');
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    },
    
    // Calculate row total
    calculateRowTotal: function(element) {
        const row = element.closest('tr');
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.rate').value) || 0;
        const amount = quantity * rate;
        
        row.querySelector('.amount').textContent = '$' + amount.toFixed(2);
        
        // Update total
        TableHandler.updateTotal();
    },
    
    // Update total amount
    updateTotal: function() {
        let total = 0;
        const amounts = document.querySelectorAll('#schedule-table tbody .amount');
        
        amounts.forEach(cell => {
            const amount = parseFloat(cell.textContent.replace('$', '')) || 0;
            total += amount;
        });
        
        document.getElementById('total-amount').textContent = '$' + total.toFixed(2);
    },
    
    // Import CSV to table
    importCSV: function(file, hasHeaderRow, clearExistingData) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const csvData = e.target.result;
            const lines = csvData.split(/\r\n|\n|\r/).filter(line => line.trim());
            
            // Skip header row if specified
            const startRow = hasHeaderRow ? 1 : 0;
            
            // Clear existing data if specified
            if (clearExistingData) {
                const tbody = document.querySelector('#schedule-table tbody');
                tbody.innerHTML = '';
            }
            
            // Process each row
            for (let i = startRow; i < lines.length; i++) {
                const cells = TableHandler.parseCSVLine(lines[i]);
                
                // Add new row
                TableHandler.addRow();
                
                // Get the last row
                const row = document.querySelector('#schedule-table tbody tr:last-child');
                
                // Fill in data (skip item number at index 0)
                if (cells.length > 1) row.querySelector('.description').value = cells[1] || '';
                if (cells.length > 2) row.querySelector('.unit').value = cells[2] || '';
                if (cells.length > 3) row.querySelector('.quantity').value = cells[3] || '';
                if (cells.length > 4) row.querySelector('.rate').value = cells[4] || '';
                
                // Calculate row total
                TableHandler.calculateRowTotal(row.querySelector('.quantity'));
            }
            
            Utilities.showToast('CSV data imported successfully', 'success');
        };
        
        reader.onerror = function() {
            Utilities.showToast('Error reading CSV file', 'error');
        };
        
        reader.readAsText(file);
    },
    
    // Parse CSV line handling quotes and commas
    parseCSVLine: function(line) {
        const result = [];
        let cell = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(cell);
                cell = '';
            } else {
                cell += char;
            }
        }
        
        result.push(cell); // Add the last cell
        
        return result.map(cell => {
            // Remove surrounding quotes and handle escaped quotes
            if (cell.startsWith('"') && cell.endsWith('"')) {
                return cell.slice(1, -1).replace(/\\"/g, '"');
            }
            return cell;
        });
    },
    
    // Export table to CSV
    exportTableToCSV: function(filename) {
        const rows = document.querySelectorAll('#schedule-table tbody tr');
        let csvContent = 'Item,Description,Unit,Quantity,Rate,Amount\n';
        
        rows.forEach(row => {
            const item = row.cells[0].textContent;
            const description = row.querySelector('.description').value;
            const unit = row.querySelector('.unit').value;
            const quantity = row.querySelector('.quantity').value;
            const rate = row.querySelector('.rate').value;
            const amount = row.querySelector('.amount').textContent;
            
            // Handle commas and quotes in fields
            const formatField = (field) => {
                field = field.toString();
                if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                    return `"${field.replace(/"/g, '""')}"`;
                }
                return field;
            };
            
            csvContent += 
                formatField(item) + ',' + 
                formatField(description) + ',' + 
                formatField(unit) + ',' + 
                formatField(quantity) + ',' + 
                formatField(rate) + ',' + 
                formatField(amount) + '\n';
        });
        
        // Create download link
        const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        
        Utilities.showToast('CSV exported successfully', 'success');
    },
    
    // Get table data for storage
    getTableData: function() {
        const rows = document.querySelectorAll('#schedule-table tbody tr');
        const items = [];
        
        rows.forEach(row => {
            items.push({
                description: row.querySelector('.description').value,
                unit: row.querySelector('.unit').value,
                quantity: row.querySelector('.quantity').value,
                rate: row.querySelector('.rate').value
            });
        });
        
        return items;
    },
    
    // Populate table from saved data
    populateTable: function(items) {
        if (!items || !items.length) return;
        
        const tbody = document.querySelector('#schedule-table tbody');
        
        // Clear existing rows except the first one
        while (tbody.children.length > 1) {
            tbody.removeChild(tbody.lastChild);
        }
        
        // First row handling
        const firstRow = tbody.children[0];
        firstRow.querySelector('.description').value = items[0].description || '';
        firstRow.querySelector('.unit').value = items[0].unit || '';
        firstRow.querySelector('.quantity').value = items[0].quantity || '';
        firstRow.querySelector('.rate').value = items[0].rate || '';
        
        // Calculate first row amount
        TableHandler.calculateRowTotal(firstRow.querySelector('.quantity'));
        
        // Add additional rows
        for (let i = 1; i < items.length; i++) {
            TableHandler.addRow();
            
            const newRow = tbody.children[i];
            newRow.querySelector('.description').value = items[i].description || '';
            newRow.querySelector('.unit').value = items[i].unit || '';
            newRow.querySelector('.quantity').value = items[i].quantity || '';
            newRow.querySelector('.rate').value = items[i].rate || '';
            
            // Calculate row amount
            TableHandler.calculateRowTotal(newRow.querySelector('.quantity'));
        }
    }
};