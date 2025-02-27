import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

function DataUploader({ onDataProcessed }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [location, setLocation] = useState('');
  const fileInputRef = useRef(null);
  
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    const newUploadedFiles = [];
    
    for (const file of files) {
      try {
        // Validate file type
        const fileType = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(fileType)) {
          throw new Error(`File "${file.name}" is not a valid Excel or CSV file`);
        }
        
        const fileData = await processExcelFile(file);
        newUploadedFiles.push(fileData);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        setError(`Error processing ${file.name}: ${error.message}`);
      }
    }
    
    if (newUploadedFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    }
    
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const processExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          let workbook;
          
          try {
            workbook = XLSX.read(data, { type: 'array' });
          } catch (e) {
            throw new Error('Unable to parse the Excel file. The file might be corrupted or in an unsupported format.');
          }
          
          if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error('The Excel file does not contain any sheets');
          }
          
          // Process the first sheet by default
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          
          if (jsonData.length === 0) {
            throw new Error('The uploaded file contains no data');
          }
          
          // Detect data type based on column headers
          const detectedType = detectDataType(jsonData);
          
          resolve({
            fileName: file.name,
            type: detectedType || 'unknown',
            data: jsonData,
            processed: false,
            id: Date.now() + Math.random().toString(36).substr(2, 9)
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read the file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };
  
  // Detect data type based on column headers
  const detectDataType = (data) => {
    if (!data || data.length === 0) return null;
    
    const headers = Object.keys(data[0]);
    
    if (headers.includes('PO #') || headers.includes('# Ordered') || headers.includes('Purchase Order')) {
      return 'purchase_orders';
    } else if (headers.includes('Invoice #') || headers.includes('Sale By') || headers.includes('Sales')) {
      return 'sales_data';
    } else if (headers.includes('On Hand') || headers.includes('In Stock') || headers.includes('Inventory')) {
      return 'inventory';
    }
    
    return null;
  };
  
  const updateFileType = (id, newType) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, type: newType } : file
      )
    );
  };
  
  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };
  
  const handleAnalyze = () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one file to analyze');
      return;
    }
    
    // Group files by type
    const filesByType = uploadedFiles.reduce((acc, file) => {
      if (!acc[file.type]) {
        acc[file.type] = [];
      }
      acc[file.type].push(file.data);
      return acc;
    }, {});
    
    // Create a consolidated dataset
    const processedData = {
      location: location,
      fileCount: uploadedFiles.length,
      filesByType: filesByType,
      allFiles: uploadedFiles.map(file => ({
        fileName: file.fileName,
        type: file.type,
        data: file.data
      }))
    };
    
    onDataProcessed(processedData);
    
    // Mark all files as processed
    setUploadedFiles(prev => 
      prev.map(file => ({ ...file, processed: true }))
    );
  };
  
  const clearAllFiles = () => {
    setUploadedFiles([]);
    setError(null);
  };
  
  return (
    <div className="data-processor">
      <h2>Upload Retail Data</h2>
      
      <div className="form-controls">
        <div className="form-group">
          <label>Store Location:</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Aberdeen, Huron, Luverne, etc."
          />
        </div>
      </div>
      
      <div className="file-upload">
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".xlsx,.xls,.csv" 
          onChange={handleFileUpload} 
          disabled={isProcessing}
          multiple
        />
        <p className="upload-help">You can select multiple files at once</p>
        
        {isProcessing && (
          <div className="processing-indicator">
            <p>Processing files...</p>
            <div className="spinner"></div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Files ({uploadedFiles.length})</h3>
          
          <div className="file-list">
            {uploadedFiles.map(file => (
              <div key={file.id} className={`file-item ${file.processed ? 'processed' : ''}`}>
                <div className="file-info">
                  <span className="file-name">{file.fileName}</span>
                  <span className="file-rows">({file.data.length} rows)</span>
                </div>
                
                <div className="file-controls">
                  <select 
                    value={file.type} 
                    onChange={(e) => updateFileType(file.id, e.target.value)}
                    className="file-type-select"
                  >
                    <option value="unknown">Select Type</option>
                    <option value="purchase_orders">Purchase Orders</option>
                    <option value="sales_data">Sales Data</option>
                    <option value="inventory">Inventory</option>
                  </select>
                  
                  <button 
                    onClick={() => removeFile(file.id)} 
                    className="remove-file-btn"
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="file-actions">
            <button 
              onClick={handleAnalyze} 
              className="analyze-btn"
              disabled={uploadedFiles.length === 0 || uploadedFiles.some(f => f.type === 'unknown')}
            >
              Analyze {uploadedFiles.length} Files
            </button>
            
            <button 
              onClick={clearAllFiles} 
              className="clear-files-btn"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataUploader; 