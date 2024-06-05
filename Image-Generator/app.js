const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "OpenAi API KEY";
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
   imgDataArray.forEach((imgObject, index) => {
      const imgCard = imageGallery.querySelectorAll(".img-card")[index];
      const imgElement = imgCard.querySelector("img");
      const downloadBtn = imgCard.querySelector(".download-btn");
       
      //set the image source to the AI-generated  image data
      const aiGeneratedImg = `data:image/jpeg;based64 ,${imgObject.b64_json}`;
      imgElement.src = aiGeneratedImg;

      // when the image is loaded, remove the loading class
      imgElement.onload = () => {
         imgCard.classList.remove("loading");
         downloadBtn.setAttribute("href", aiGeneratedImg);
         downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
      }
   });
}
const generateAiImages = async (userPrompt, userImgQuantity) => {
   console.log(userPrompt ,userImgQuantity);
   try{
      // Send a request to the OpenAI API to generate images based on user inputs
       const response = await fetch("https://api.openai.com/v1/images/generations", {
          method:"POST",
          headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: userPrompt,
            n: userImgQuantity,
            size: "512x512",
            response_format: "b64_json"
          }),
       });

       if(!response.ok) throw new Error("Failed to generate images! please try again.");


       const { data } = await response.json(); // get data from the response
      updateImageCard([...data]);
   } catch(error){
     alert(error.message);
   } finally {
      generateBtn.removeAttribute("disabled");
      generateBtn.innerText = "Generate";
      isImageGenerating = false;
   }
}

const handleFormSubmission = (e) => {
   e.preventDefault();
   if(isImageGenerating) return;

   //get user input and image values from the form

   const userPrompt = e.srcElement[0].value;
   const userImgQuantity = parseInt(e.srcElement[1].value);
   
    // Disable the generate button, update its text, and set the flag
  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating";
  isImageGenerating = true;

   //creating HTML markup for image cards with loading state

   const imgCardMarkup = Array.from({length: userImgQuantity},() =>
   `<div class="img-card loading">
   <img src="img/loader.svg" alt="image">
   <a href="#" class="download-btn">
   <img src="img/arrow.svg" height="20px" alt="download icon">
   </a>
   </div>`
   ).join("");

   imageGallery.innerHTML = imgCardMarkup;
   generateAiImages(userPrompt, userImgQuantity);
}
generateForm.addEventListener("submit", handleFormSubmission);
