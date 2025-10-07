import { put, del } from "@vercel/blob"

// Upload file to Vercel Blob
export async function uploadFile(file, folder = "uploads") {
  try {
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    return {
      success: true,
      url: blob.url,
      key: blob.pathname,
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Delete file from Vercel Blob
export async function deleteFile(url) {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
