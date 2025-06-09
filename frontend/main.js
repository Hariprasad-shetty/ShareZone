const dropZone=document.querySelector(".drop-zone");
const fileInput=document.querySelector("#fileInput");
const browseBtn=document.querySelector(".browseBtn");
const bgProgress=document.querySelector(".bg-progress");
const percentDiv=document.querySelector("#percent");
const progressBar=document.querySelector(".progress-bar");
const progressContainer=document.querySelector(".progress-container");
const fileUrl=document.querySelector("#fileUrl");
const sharingContainer=document.querySelector(".sharing-container");
const copyBtn=document.querySelector("#copyBtn");
const emailForm=document.querySelector("#emailForm");
const toast=document.querySelector(".toast");
const maxAllowedSize=100*1024*1024;


/*const host="https://innshare.herokuapp.com/"*/
const host="http://localhost:3000/";
const uploadUrl=`${host}api/files`
const emailUrl=`${host}api/files/send`


dropZone.addEventListener("dragover",(e)=>{
  e.preventDefault();
  if(!dropZone.classList.contains("dragged")){
    dropZone.classList.add("dragged");
  }
})

dropZone.addEventListener("dragleave",()=>{
  dropZone.classList.remove("dragged");
})

dropZone.addEventListener("drop",(e)=>{
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files=e.dataTransfer.files;
  if(files.length){
    fileInput.files=files;
    uploadFile();
  }
})

fileInput.addEventListener("change",()=>{
  uploadFile();
})

browseBtn.addEventListener("click",()=>{
  fileInput.click();
})

copyBtn.addEventListener("click",()=>{
  fileUrl.select();
  document.execCommand("copy");
  showToast("Link copied");
})

const uploadFile=()=>{
  
  if(fileInput.files.length>1){
    fileInput.value="";
    showToast("Only upload 1 file!");
    return;
  }
  const file=fileInput.files[0];
  if(file.size>maxAllowedSize){
    showToast("Can't upload more 100mb");
    fileInput.value="";
    return;
  }
  progressContainer.style.display="block";
  
  const formData=new FormData();
  formData.append("myfile",file);
  
  const xhr=new XMLHttpRequest();
  xhr.onreadystatechange=()=>{
    if(xhr.readyState===xhr.DONE){
      console.log(xhr.response)
      showLink(JSON.parse(xhr.response));
    }
  }
  
  xhr.upload.onprogress=updateProgress;
  xhr.upload.onerror=()=>{
    fileInput.value="";
    showToast(`Error in upload ${xhr.statusText}`)
  }
  xhr.open("POST",uploadUrl);
  xhr.send(formData);
  
}

const updateProgress=(e)=>{
  const percent=Math.round((e.loaded/e.total)*100);
  console.log(e);
  bgProgress.style.width=`${percent}%`;
  percentDiv.textContent=percent;
  progressBar.style.transform=`scaleX(${percent/100})`;
}

const showLink=({file:url})=>{
  console.log(url);
  fileInput.value="";
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display="none";
  sharingContainer.style.display="block";
  fileUrl.value=url;
}

emailForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const url=fileUrl.value;
  const formData={
    uuid:url.split("/").splice(-1,1)[0],
    emailTo:emailForm.elements["to-email"].value,
    emailFrom:emailForm.elements["from-email"].value,
  }
  
  emailForm[2].setAttribute("disabled",true);
  
  fetch(emailUrl,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then(res=>res.json()).then(({success})=>{
    if(success){
      sharingContainer.style.display="none";
      showToast("Email send");
    }
    
  })
})

let toastTimer;
const showToast=(msg)=>{
  toast.textContent=msg;
  toast.style.transform="translate(-50%,0)";
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{
    toast.style.transform="translate(-50%,60px)";
  },2000)
}


