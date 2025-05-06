// BuildCo Scope of Works Generator - Main Module

// Helper functions
const Utilities = {
    // Sanitize input to prevent XSS
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return '';
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },
    
    // Debounce function to limit execution frequency
    debounce: (func, wait) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    
    // Show loading indicator
    showLoading: (message = 'Loading...') => {
        const loadingIndicator = document.getElementById('loading-indicator');
        const loadingMessage = document.getElementById('loading-message');
        
        loadingMessage.textContent = message;
        loadingIndicator.style.display = 'flex';
    },
    
    // Hide loading indicator
    hideLoading: () => {
        const loadingIndicator = document.getElementById('loading-indicator');
        loadingIndicator.style.display = 'none';
    },
    
    // Show toast notification
    showToast: (message, type = 'info') => {
        const toastContainer = document.getElementById('toast-container');
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Set icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div class="toast-message">${message}</div>
        `;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
};

// UI Components initialization
const UIComponents = {
    // Initialize collapsible sections
    initializeCollapsibles: () => {
        const coll = document.getElementsByClassName("collapsible");
        
        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                
                const content = document.getElementById(this.getAttribute('aria-controls'));
                content.setAttribute('aria-hidden', expanded);
                
                if (expanded) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    },
    
    // Initialize trade selector
    initializeTradeSelector: () => {
        const tradeSelect = document.getElementById('trade-select');
        const customTradeRow = document.getElementById('custom-trade-row');
        const customTradeInput = document.getElementById('custom-trade');
        const scopeTextarea = document.getElementById('scope-of-works');
        
        // Add event listener for trade selection changes
        tradeSelect.addEventListener('change', function() {
            const selectedTrade = this.value;
            
            if (selectedTrade === 'custom') {
                // Show custom trade input and clear scope
                customTradeRow.style.display = 'flex';
                customTradeInput.setAttribute('required', 'required');
                scopeTextarea.value = '';
            } else {
                // Hide custom trade input and populate scope
                customTradeRow.style.display = 'none';
                customTradeInput.removeAttribute('required');
                
                // Set the scope content based on selected trade
                if (selectedTrade && TradeData.tradeScopes[selectedTrade]) {
                    scopeTextarea.value = TradeData.tradeScopes[selectedTrade];
                } else {
                    scopeTextarea.value = '';
                }
            }
            
            // Update character counter
            FormHandler.updateCharCounter();
            
            // Update progress bar
            FormHandler.updateProgressBar();
        });
    },
    
    // Update character counter for textarea
    updateCharCounter: () => {
        const scopeTextarea = document.getElementById('scope-of-works');
        const counter = document.getElementById('scope-counter');
        
        if (scopeTextarea && counter) {
            counter.textContent = scopeTextarea.value.length;
        }
    },
    
    // Update progress bar
    updateProgressBar: () => {
        const requiredFields = document.querySelectorAll('[required]');
        let filledCount = 0;
        
        requiredFields.forEach(field => {
            if (field.value) filledCount++;
        });
        
        const percentage = requiredFields.length > 0 
            ? Math.round((filledCount / requiredFields.length) * 100) 
            : 0;
        
        document.getElementById('progress-bar').style.width = `${percentage}%`;
    }
};

// Form validation and handling
const FormHandler = {
    // Validate form
    validateForm: () => {
        const projectName = document.getElementById('project-name');
        const projectNumber = document.getElementById('project-number');
        const subcontractorName = document.getElementById('subcontractor-name');
        const date = document.getElementById('date');
        const tradeSelect = document.getElementById('trade-select');
        const customTrade = document.getElementById('custom-trade');
        
        let isValid = true;
        
        // Clear previous validation errors
        FormHandler.clearValidationErrors();
        
        // Validate required fields
        if (!projectName.value) {
            FormHandler.showFieldError(projectName, 'Project Name is required');
            isValid = false;
        }
        
        if (!projectNumber.value) {
            FormHandler.showFieldError(projectNumber, 'Project Number is required');
            isValid = false;
        }
        
        if (!subcontractorName.value) {
            FormHandler.showFieldError(subcontractorName, 'Subcontractor Name is required');
            isValid = false;
        }
        
        if (!date.value) {
            FormHandler.showFieldError(date, 'Date is required');
            isValid = false;
        }
        
        if (!tradeSelect.value) {
            FormHandler.showFieldError(tradeSelect, 'Trade selection is required');
            isValid = false;
        }
        
        if (tradeSelect.value === 'custom' && !customTrade.value) {
            FormHandler.showFieldError(customTrade, 'Custom Trade Name is required');
            isValid = false;
        }
        
        // If validation fails, show validation summary
        if (!isValid) {
            FormHandler.showValidationSummary();
        }
        
        return isValid;
    },
    
    // Show field error
    showFieldError: (field, message) => {
        field.classList.add('input-error');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    },
    
    // Clear validation errors
    clearValidationErrors: () => {
        const errorFields = document.querySelectorAll('.input-error');
        errorFields.forEach(field => {
            field.classList.remove('input-error');
        });
        
        const errorMessages = document.querySelectorAll('.field-error');
        errorMessages.forEach(element => {
            element.textContent = '';
        });
        
        const validationSummary = document.getElementById('validation-summary');
        if (validationSummary) {
            validationSummary.style.display = 'none';
        }
    },
    
    // Show validation summary
    showValidationSummary: () => {
        const validationSummary = document.getElementById('validation-summary');
        const validationErrors = document.getElementById('validation-errors');
        const validationHeading = document.querySelector('.validation-heading');
        
        // Clear previous errors
        validationErrors.innerHTML = '';
        
        // Get all error fields
        const errorFields = document.querySelectorAll('.input-error');
        
        // Set summary heading
        validationHeading.textContent = `Please correct ${errorFields.length} error${errorFields.length !== 1 ? 's' : ''} in the form.`;
        
        // Add errors to list
        errorFields.forEach(field => {
            const label = document.querySelector(`label[for="${field.id}"]`);
            const fieldName = label ? label.textContent.replace('*', '') : field.id;
            const errorMessage = document.getElementById(`${field.id}-error`).textContent;
            
            const listItem = document.createElement('li');
            listItem.textContent = `${fieldName}: ${errorMessage}`;
            validationErrors.appendChild(listItem);
        });
        
        // Show validation summary
        validationSummary.style.display = 'block';
        
        // Scroll to top of form
        validationSummary.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Setup form field validation
    setupFormValidation: () => {
        // Add form field validation event listeners
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                // Validate field when focus leaves
                if (!this.value) {
                    FormHandler.showFieldError(this, `${field.id.replace('-', ' ')} is required`);
                } else {
                    this.classList.remove('input-error');
                    const errorElement = document.getElementById(`${this.id}-error`);
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                }
                
                // Update progress bar
                UIComponents.updateProgressBar();
            });
        });
    },
    
    // Update character counter
    updateCharCounter: UIComponents.updateCharCounter,
    
    // Update progress bar
    updateProgressBar: UIComponents.updateProgressBar
};

// Document preview and export
const DocumentHandler = {
    // Preview document
    previewDocument: () => {
        // Validate form
        if (!FormHandler.validateForm()) {
            return;
        }

        // Show loading indicator
        Utilities.showLoading('Generating Preview...');
        
        // Generate document HTML
        const documentHTML = DocumentHandler.generateDocumentHTML();
        
        // Display preview
        document.getElementById('document-preview').innerHTML = documentHTML;
        document.getElementById('preview-container').style.display = 'block';
        
        // Hide loading indicator
        Utilities.hideLoading();
    },
    
    // Close preview
    closePreview: () => {
        document.getElementById('preview-container').style.display = 'none';
    },
    
    // Print preview
    printPreview: () => {
        window.print();
    },
    
    // Export as PDF
    exportAsPDF: () => {
        // Validate form
        if (!FormHandler.validateForm()) {
            return;
        }

        // Show loading indicator
        Utilities.showLoading('Generating PDF...');
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            
            // Create a temporary div to hold the document content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = DocumentHandler.generateDocumentHTML();
            tempDiv.className = 'pdf-content';
            document.body.appendChild(tempDiv);
            
            // Use html2canvas to convert the div to an image
            html2canvas(tempDiv, {
                scale: 2, // Higher resolution
                useCORS: true,
                logging: false
            }).then(canvas => {
                // Remove the temporary div
                document.body.removeChild(tempDiv);
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 295; // A4 height in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                
                // Add image to PDF
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                
                // Add new pages if content overflows
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                // Save PDF
                const projectNumber = document.getElementById('project-number').value;
                const tradeSelect = document.getElementById('trade-select').value;
                const customTrade = document.getElementById('custom-trade').value;
                let tradeName = tradeSelect === 'custom' ? customTrade : tradeSelect;
                
                doc.save(`BuildCo_${projectNumber}_${tradeName}_SOW.pdf`);
                
                // Hide loading indicator
                Utilities.hideLoading();
                
                // Show success message
                Utilities.showToast('PDF created successfully', 'success');
            }).catch(error => {
                console.error('PDF generation error:', error);
                Utilities.hideLoading();
                Utilities.showToast('Error generating PDF', 'error');
            });
        } catch (error) {
            console.error('PDF generation error:', error);
            Utilities.hideLoading();
            Utilities.showToast('Error generating PDF', 'error');
        }
    },
    
    // Export as DOCX
    exportAsDOCX: () => {
        // Validate form
        if (!FormHandler.validateForm()) {
            return;
        }
        
        // Show loading indicator
        Utilities.showLoading('Generating DOCX...');
        
        try {
            const content = DocumentHandler.generateDocumentHTML();
            const converted = htmlDocx.asBlob(content);
            
            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(converted);
            
            // Set filename
            const projectNumber = document.getElementById('project-number').value;
            const tradeSelect = document.getElementById('trade-select').value;
            const customTrade = document.getElementById('custom-trade').value;
            let tradeName = tradeSelect === 'custom' ? customTrade : tradeSelect;
            
            link.download = `BuildCo_${projectNumber}_${tradeName}_SOW.docx`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Hide loading indicator
            Utilities.hideLoading();
            
            // Show success message
            Utilities.showToast('DOCX created successfully', 'success');
        } catch (error) {
            console.error('DOCX generation error:', error);
            Utilities.hideLoading();
            Utilities.showToast('Error generating DOCX', 'error');
        }
    },
    
    // Generate document HTML
    generateDocumentHTML: () => {
        const projectName = Utilities.sanitizeInput(document.getElementById('project-name').value);
        const projectNumber = Utilities.sanitizeInput(document.getElementById('project-number').value);
        const subcontractorName = Utilities.sanitizeInput(document.getElementById('subcontractor-name').value);
        const date = document.getElementById('date').value;
        const formattedDate = new Date(date).toLocaleDateString('en-AU');
        
        // Get trade name
        const tradeSelect = document.getElementById('trade-select').value;
        const customTrade = document.getElementById('custom-trade').value;
        let tradeName = '';
        
        if (tradeSelect === 'custom') {
            tradeName = customTrade;
        } else {
            const tradeOptions = document.getElementById('trade-select').options;
            for (let i = 0; i < tradeOptions.length; i++) {
                if (tradeOptions[i].value === tradeSelect) {
                    tradeName = tradeOptions[i].text;
                    break;
                }
            }
        }
        
        const scopeOfWorks = Utilities.sanitizeInput(document.getElementById('scope-of-works').value);
        const siteConditions = Utilities.sanitizeInput(document.getElementById('site-conditions-content').value);
        
        // Create schedule of rates table HTML
        let scheduleHTML = `
            <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f0f4f8;">
                        <th>Item</th>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Quantity</th>
                        <th>Rate ($)</th>
                        <th>Amount ($)</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        const rows = document.querySelectorAll('#schedule-table tbody tr');
        rows.forEach(row => {
            const item = row.cells[0].textContent;
            const description = Utilities.sanitizeInput(row.querySelector('.description').value);
            const unit = Utilities.sanitizeInput(row.querySelector('.unit').value);
            const quantity = Utilities.sanitizeInput(row.querySelector('.quantity').value);
            const rate = Utilities.sanitizeInput(row.querySelector('.rate').value);
            const amount = row.querySelector('.amount').textContent;
            
            scheduleHTML += `
                <tr>
                    <td>${item}</td>
                    <td>${description}</td>
                    <td>${unit}</td>
                    <td>${quantity}</td>
                    <td>${rate}</td>
                    <td>${amount}</td>
                </tr>
            `;
        });
        
        scheduleHTML += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="5" style="text-align: right;"><strong>Total:</strong></td>
                        <td><strong>${document.getElementById('total-amount').textContent}</strong></td>
                    </tr>
                </tfoot>
            </table>
        `;
        
        // Assemble complete document
        const documentHTML = `
            <div style="font-family: 'Calibri', Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #003366; margin-bottom: 5px;">BUILD CO PROJECTS PTY LTD</h1>
                    <h2 style="color: #003366; margin-top: 5px;">SCOPE OF WORKS - ${tradeName.toUpperCase()}</h2>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="width: 30%; padding: 5px;"><strong>Project Name:</strong></td>
                            <td style="padding: 5px;">${projectName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px;"><strong>Project Number:</strong></td>
                            <td style="padding: 5px;">${projectNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px;"><strong>Subcontractor:</strong></td>
                            <td style="padding: 5px;">${subcontractorName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px;"><strong>Date:</strong></td>
                            <td style="padding: 5px;">${formattedDate}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #003366; border-bottom: 1px solid #ccc; padding-bottom: 5px;">SCOPE OF WORKS</h3>
                    <pre style="white-space: pre-wrap; font-family: 'Calibri', Arial, sans-serif; margin: 0;">${scopeOfWorks}</pre>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #003366; border-bottom: 1px solid #ccc; padding-bottom: 5px;">SITE CONDITIONS</h3>
                    <pre style="white-space: pre-wrap; font-family: 'Calibri', Arial, sans-serif; margin: 0;">${siteConditions}</pre>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #003366; border-bottom: 1px solid #ccc; padding-bottom: 5px;">SCHEDULE OF RATES</h3>
                    ${scheduleHTML}
                </div>
                
                <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #666;">
                    <p><strong>Document Number:</strong> BCP-SOW-ANNEXB-V1 | <strong>Version:</strong> 1.0 | <strong>Issue Date:</strong> 05/05/2025</p>
                    <p>&copy; Build Co Projects Pty Ltd 2025. All rights reserved.</p>
                </div>
            </div>
        `;
        
        return documentHTML;
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    UIComponents.initializeCollapsibles();
    UIComponents.initializeTradeSelector();
    
    // Initialize table
    TableHandler.initializeTable();
    
    // Load form data from local storage
    StorageHandler.loadFormFromLocalStorage();
    
    // Setup auto-save
    StorageHandler.setupAutoSave();
    
    // Setup form validation
    FormHandler.setupFormValidation();
    
    // Setup character counter
    document.getElementById('scope-of-works').addEventListener('input', UIComponents.updateCharCounter);
    
    // Setup preview and export functionality
    document.getElementById('btn-preview').addEventListener('click', DocumentHandler.previewDocument);
    document.getElementById('btn-export-pdf').addEventListener('click', DocumentHandler.exportAsPDF);
    document.getElementById('btn-export-docx').addEventListener('click', DocumentHandler.exportAsDOCX);
    document.getElementById('close-preview').addEventListener('click', DocumentHandler.closePreview);
    document.getElementById('btn-print').addEventListener('click', DocumentHandler.printPreview);
});
