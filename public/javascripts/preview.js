// Image preview function, takes image file that is selected when user chooses a image to upload and assigns a temp URL so image can be displayed in the view.  Frees
// up memory once images loads. 
const preview = (e) => {
  const output = document.getElementById("output");
  output.src = URL.createObjectURL(e.target.files[0]);
  output.onload = () => {
    URL.revokeObjectURL(output.src);
  };
};
