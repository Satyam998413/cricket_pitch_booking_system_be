 export const handler=async(req, res)=> {
  // CORS HEADERS (MANDATORY)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // 🔥 Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Your real logic
  if (req.method === "POST") {
    return res.status(200).json({
      success: true,
      message: "Image generated",
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
