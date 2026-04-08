export function exportToPDF(resumeHTML, candidateName = "Resume") {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${candidateName} — Resume</title>
  <style>
    /* Reset and base styles for ATS compatibility */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    /* Use standard ATS-safe fonts */
    body { 
      font-family: Arial, Helvetica, sans-serif; 
      background: white; 
      color: #000;
      line-height: 1.4;
      font-size: 11pt;
    }
    
    /* Ensure text is selectable and extractable */
    * {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
    
    /* Page setup for A4 */
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    
    @media print {
      html, body { 
        width: 210mm; 
        min-height: 297mm; 
        background: white !important;
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact;
      }
      
      /* Ensure all text is black for better OCR */
      * {
        color: #000 !important;
        background: transparent !important;
      }
      
      /* Hide any interactive elements */
      button, .no-print { display: none !important; }
      
      /* Ensure links show their URL */
      a[href]:after {
        content: " (" attr(href) ")";
        font-size: 9pt;
        color: #333;
      }
    }
    
    /* ATS-friendly structure - clear section headings */
    h1, h2, h3, h4, h5, h6 {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 6pt;
    }
    
    /* Ensure proper spacing for readability */
    p, li {
      margin-bottom: 4pt;
      orphans: 3;
      widows: 3;
    }
    
    /* Lists should be properly formatted */
    ul, ol {
      margin-left: 20pt;
      margin-bottom: 8pt;
    }
    
    li {
      margin-bottom: 2pt;
    }
    
    /* Tables for layout should have visible structure */
    table {
      border-collapse: collapse;
      width: 100%;
    }
    
    td, th {
      vertical-align: top;
      padding: 4pt;
    }
  </style>
</head>
<body>
  <!-- Main resume container with semantic structure -->
  <main role="main" id="resume-content">
    ${resumeHTML}
  </main>
  
  <script>
    // Ensure the document is fully loaded before printing
    window.onload = function() {
      // Small delay to ensure fonts and layout are ready
      setTimeout(function() {
        // Check if content is properly rendered
        const content = document.getElementById('resume-content');
        if (content && content.innerText.length > 0) {
          window.print();
        } else {
          console.error('Resume content not properly loaded');
          alert('Error generating PDF. Please try again.');
        }
        
        window.onafterprint = function() { 
          window.close(); 
        };
      }, 800);
    };
    
    // Fallback close if print is cancelled
    setTimeout(function() {
      if (!window.printTriggered) {
        window.close();
      }
    }, 10000);
  </script>
</body>
</html>`);

  printWindow.document.close();
}

/**
 * Validates that the generated PDF content is ATS-friendly
 * Returns warnings if potential issues are detected
 */
export function validateATSCompatibility(resumeData) {
  const warnings = [];
  
  // Check for common ATS issues
  if (!resumeData.name || resumeData.name.length < 2) {
    warnings.push("Name is missing or too short");
  }
  
  if (!resumeData.email || !resumeData.email.includes('@')) {
    warnings.push("Valid email address is recommended");
  }
  
  if (!resumeData.skills || resumeData.skills.length < 3) {
    warnings.push("Add more skills for better ATS matching");
  }
  
  // Check for special characters that might confuse ATS
  const specialChars = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  
  const textToCheck = JSON.stringify(resumeData);
  if (specialChars.test(textToCheck)) {
    warnings.push("Remove emojis or special characters for better ATS compatibility");
  }
  
  // Check section headers
  const hasProjects = resumeData.projects && resumeData.projects.length > 0;
  const hasExperience = resumeData.experience && resumeData.experience.length > 0;
  
  if (!hasProjects && !hasExperience) {
    warnings.push("Add projects or work experience");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    score: Math.max(0, 100 - (warnings.length * 15))
  };
}