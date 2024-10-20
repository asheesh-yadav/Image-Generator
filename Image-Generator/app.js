
const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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"; 
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
   imgDataArray.forEach((imgObject, index) => {
      const imgCard = imageGallery.querySelectorAll(".img-card")[index];
      const imgElement = imgCard.querySelector("img");
      const downloadBtn = imgCard.querySelector(".download-btn");
       
   
      const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
      imgElement.src = aiGeneratedImg;

   
      imgElement.onload = () => {
         imgCard.classList.remove("loading");
         downloadBtn.setAttribute("href", aiGeneratedImg);
         downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
      }
   });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
   console.log(userPrompt, userImgQuantity);  
   try {
     
       const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
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

       if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to generate images! API response: ${errorText}`);
       }

       const { data } = await response.json(); 
       console.log(data);  
       updateImageCard([...data]);

   } catch (error) {
      console.error("Error:", error);  
      alert(error.message);
   } finally {
      generateBtn.removeAttribute("disabled");
      generateBtn.innerText = "Generate";
      isImageGenerating = false;
   }
}

const handleFormSubmission = (e) => {
   e.preventDefault();
   if (isImageGenerating) return;

  
   const userPrompt = e.srcElement[0].value;
   const userImgQuantity = parseInt(e.srcElement[1].value);

   if (!userPrompt || isNaN(userImgQuantity) || userImgQuantity <= 0) {
       alert("Please enter a valid prompt and number of images.");
       return;
   }
   
   
   generateBtn.setAttribute("disabled", true);
   generateBtn.innerText = "Generating";
   isImageGenerating = true;

 
   const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
      `<div class="img-card loading">
         <img src="img/loader.svg" alt="loading">
         <a href="#" class="download-btn">
            <img src="img/arrow.svg" height="20px" alt="download icon">
         </a>
      </div>`
   ).join("");

   imageGallery.innerHTML = imgCardMarkup;
   generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);
