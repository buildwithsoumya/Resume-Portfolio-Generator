function PreviewFrame({
  html
}) {
  if (!html) return null;
  return (
    <iframe
      title="Portfolio Preview"
      srcDoc={html}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        borderRadius: "12px"
      }}
    />
  );
}
export default PreviewFrame;