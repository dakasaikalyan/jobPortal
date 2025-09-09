const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/resumes',
    'uploads/company-logos',
    'uploads/documents',
    'uploads/images',
    'uploads/portfolios'
  ]
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

createUploadDirs()

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'application/rtf': ['.rtf']
  }

  const fileType = file.mimetype
  const fileExt = path.extname(file.originalname).toLowerCase()

  if (allowedTypes[fileType] && allowedTypes[fileType].includes(fileExt)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${fileType} with extension ${fileExt} is not allowed`), false)
  }
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/documents'
    
    if (file.fieldname === 'resume') {
      uploadPath = 'uploads/resumes'
    } else if (file.fieldname === 'logo') {
      uploadPath = 'uploads/company-logos'
    } else if (file.fieldname === 'portfolio') {
      uploadPath = 'uploads/portfolios'
    } else if (file.mimetype.startsWith('image/')) {
      uploadPath = 'uploads/images'
    }
    
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    cb(null, `${name}-${uniqueSuffix}${ext}`)
  }
})

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
})

// Image optimization function
const optimizeImage = async (filePath, outputPath, options = {}) => {
  try {
    const { width = 800, height = 600, quality = 80 } = options
    
    await sharp(filePath)
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality })
      .toFile(outputPath)
    
    // Remove original file if optimization was successful
    if (filePath !== outputPath) {
      fs.unlinkSync(filePath)
    }
    
    return outputPath
  } catch (error) {
    console.error('Image optimization error:', error)
    return filePath // Return original if optimization fails
  }
}

// File validation function
const validateFile = (file, requirements = {}) => {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = requirements
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`)
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
    throw new Error(`File type ${file.mimetype} is not allowed`)
  }
  
  return true
}

// Clean up old files function
const cleanupOldFiles = (filePath, maxAge = 7 * 24 * 60 * 60 * 1000) => { // 7 days
  try {
    const stats = fs.statSync(filePath)
    const now = new Date()
    const fileAge = now - stats.mtime
    
    if (fileAge > maxAge) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('File cleanup error:', error)
    return false
  }
}

// Get file info function
const getFileInfo = (file) => {
  return {
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    uploadDate: new Date()
  }
}

// Delete file function
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
}

module.exports = {
  upload,
  optimizeImage,
  validateFile,
  cleanupOldFiles,
  getFileInfo,
  deleteFile,
  createUploadDirs
}
