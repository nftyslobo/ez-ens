export default function handler(req, res) {
    // Get data submitted in request's body.
    const body = req.body
  
    // and returns early if they are not found
    if (!body.primary_name) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'No Name Entered' })
    }
  
    // Found the name.
    // Sends a HTTP success code
    res.status(200).json({ data: `${body.primary_name}` })
  }