/**
 * Select items
 */
const alert = document.querySelector('.form__alert');
const form = document.querySelector('.form__info');
const input = document.getElementById('todo');
const submitBtn = document.querySelector('.submit');
const listItems = document.querySelector('.list__item');
const section = document.querySelector('#main');
const btnClear = document.querySelector('.clear');


/*Edit option */
let editElement;
let editFlag = false;
let editId = '';


/* Events */
window.addEventListener('DOMContentLoaded',loadContent);
form.addEventListener('submit',addItem);
btnClear.addEventListener('click',clearItems);


/* functions */
function addItem(e)
{
    e.preventDefault();

    const value = input.value;

    const id = new Date().getTime().toString();
  
    if(value && !editFlag){
        
        const element = document.createElement('div');
        element.classList.add('list');
        const attribute = document.createAttribute('data-id');
        attribute.value = id;
        element.setAttributeNode(attribute);

        element.innerHTML = `
          
        <div class="list__item">

        <p class="list__text">${value}</p>
        <div class="list__action">
            <button class="list__button" id="edit">
                <i class="fas fa-edit" class="list__button--edit"></i>
            </button>
            <button class="list__button" id="delete">
                <i class="fas fa-trash" class="list__button--delete"></i>
            </button>
        </div>
    </div> 
</div>
        `;
        const editBtn = element.querySelector('#edit');
        const deleteBtn = element.querySelector('#delete');

   deleteBtn.addEventListener('click',deleteItem);
   editBtn.addEventListener('click',editItem);

       

        Swal.fire({
            title: '<strong>Item Added <u></u></strong>',
            icon: 'success',
            html:
              '<b style="color:hsl(125, 67%, 44%);">Successfuly</b>, ',
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText:
              '<i class="fa fa-thumbs-up"></i> Great!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
           
          })
      
       setTimeout(() => {
         
        section.appendChild(element)
        btnClear.classList.remove('hidden');
        //add To localStorage
        addToLocalStorage(id,value);

        //setBackToDefault
        setBackToDefault("more");

       },2000);
      
    }
 
    else if(value && editFlag){
    

              // editElement.innerHTML = value;

              Swal.fire({
                title: 'Do you want to edit this item',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: `No`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                   
                        editElement.innerHTML = value;
                        Swal.fire('Item updated', '', 'success')
                        editLocalStorage(editId,value);
                        setBackToDefault("submit");
                        input.value="";
                      
                        
                } else if (result.isDenied) {
                  Swal.fire('Changes are not saved', '', 'info')
                }
              })


    }else{

        let timerInterval
        Swal.fire({
          title: '<h2 style="color:red">Error</h2>',
          html: '<span style="color:#E94703; font-size:25px">You can not send Empty Value</span>',
          timer: 3000,
          timerProgressBar: true,
        
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('span')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft() + ' s'
            }, 1300)
          },

          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
          }
        })
        
    }
}


function clearItems(){

const items = [...document.querySelectorAll('.list')];

Swal.fire({
    title: 'Do you want to clear items?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    denyButtonText: `No`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
        if(items.length > 0)
        {
            items.forEach((item) => {
          
                section.removeChild(item);
                btnClear.classList.add('hidden');
        
               })
            Swal.fire('Item clearead!', '', 'success')
  
            setBackToDefault("submit");
            localStorage.removeItem('list');
        }
   
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })

   
}


function deleteItem(e){

  
       const element = e.currentTarget
       .parentElement
       .parentElement
       .parentElement;

       console.log(element);

      const id = element.dataset.id;

       Swal.fire({
        title: 'Do you want to delete this item?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
               element.parentElement.removeChild(element);
               Swal.fire('Item deleted!', '', 'success');
               removeFromLocalStorage(id);   
       
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })

      
      const items = [...document.querySelectorAll('.list')];

      if(items.length === 1)
      {
          setBackToDefault('submit');
          btnClear.classList.add("hidden");
         
          
      }

 
    
}

function editItem(e){
  const element = e.currentTarget
  .parentElement
  .parentElement
  .parentElement;

  //set edit item
 editElement = e.currentTarget.parentElement.previousElementSibling;


 // Set form value
 input.value = editElement.innerHTML;
 editFlag = true;
 editId = element.dataset.id;

 submitBtn.textContent = "edit";
 
 
}


//function remise a zero 
function setBackToDefault(flag){

  input.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = flag;
}

/****** Local Storage *****/
function addToLocalStorage(id,value){

  const lists = {id,value};
  let items = getFromLocalStorage();
  items.push(lists);
  localStorage.setItem('list',JSON.stringify(items));

  console.log(items);

}

function  removeFromLocalStorage(id)
{
    let items = getFromLocalStorage();
    items = items.filter((item) => {
         if(item.id !== id){
             return item;
         }
    })
    localStorage.setItem('list',JSON.stringify(items));
}


function editLocalStorage(id,value){

  let items = getFromLocalStorage();

  items=items.map((item) => {

       if(item.id === id)
       {
         item.value = value;
       }

       return item;
  })

  localStorage.setItem('list',JSON.stringify(items));
}

function getFromLocalStorage(){
  return localStorage.getItem('list') ? 
  JSON.parse(localStorage.getItem('list')) :
  [];
}


function loadContent(){

  const items = getFromLocalStorage();

  Swal.fire({
    title: 'Welcome to your app',
    text: "Choose yes to enter and load data or no to quit",
    icon: 'warning',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, enter'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Welcome',
        'Your content is loaded',
        'success'
      )

      if(items.length > 0){
           
        items.forEach((item) => {
    
            createListItem(item.id,item.value)
        })
       }
    } 
  })
}


  function createListItem(id,value){

     
    const element = document.createElement('div');
    element.classList.add('list');
    const attribute = document.createAttribute('data-id');
    attribute.value = id;
    element.setAttributeNode(attribute);

    element.innerHTML = `
      
    <div class="list__item">

    <p class="list__text">${value}</p>
    <div class="list__action">
        <button class="list__button" id="edit">
            <i class="fas fa-edit" class="list__button--edit"></i>
        </button>
        <button class="list__button" id="delete">
            <i class="fas fa-trash" class="list__button--delete"></i>
        </button>
    </div>
</div> 
</div>
    `;
    const editBtn = element.querySelector('#edit');
    const deleteBtn = element.querySelector('#delete');

deleteBtn.addEventListener('click',deleteItem);
editBtn.addEventListener('click',editItem);
section.appendChild(element)

}






