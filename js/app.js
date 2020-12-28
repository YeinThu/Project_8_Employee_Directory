// global variables
let employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12';
const gridContainer = document.querySelector('.gallery');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const searchInput = document.querySelector('#search');

// fetch employee data
fetch(urlAPI)
  .then(res => res.json())
  .then(resData => resData.results)
  .then(displayEmployees)
  .catch(err => console.log(err))
;

// display employees
function displayEmployees(employeeData) {
  employees = employeeData;

  // set output html
  let employeeHTML = '';

  // loop through employees
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;

    // render template to html output
    employeeHTML += `
      <div class="card" data-index="${index}">
        <img class="avatar" src="${picture.large}">
        <div class="text-container">
          <h2 class="name">${name.first} ${name.last}</h2>
          <p class="email">${email}</p>
          <p class="city">${city}</p>
        </div>
      </div>
    `;
  })

  // append html to 'gridContainer'
  gridContainer.innerHTML = employeeHTML;
}

// display modal
function displayModal(index) {
  // get variables by using object destructuring
  let { name, dob, phone, email, location: { city, street, state, postcode }, picture } = employees[index];

  // get date of birth
  let date = new Date(dob.date);

  // create output html
  const modalHTML = `
    <img class="avatar" src="${picture.large}">
    <div class="text-container">
      <h2 class="name">${name.first} ${name.last}</h2>
      <p class="email"><i class="fas fa-caret-left fa-2x"></i><span>${email}</span><i class="fas fa-caret-right fa-2x"></i></p>
      <p class="city">${city}</p>
      <hr>
      <p class="phone">${phone}</p>
      <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
      <p class="dob">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
  `;

  overlay.classList.remove('hidden');
  modalContent.innerHTML = modalHTML;
}

// gridContainer click event
gridContainer.addEventListener('click', e => {
  if (e.target !== gridContainer) {
    // select the card element based on its proximity to actual element clicked
    const card = e.target.closest('.card');
    const index = card.getAttribute('data-index');

    // call 'displayModal'
    displayModal(index);

    // call 'scroll' function
    scrollModal(index);
  }
})

// modal close click event
modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
})

// scrolling through employees functionality
function scrollModal(index) {
  let counter = index

  document.querySelector('.modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-caret-right')) {
      if (counter < employees.length - 1) {
        counter++;
      }
      else {
        counter = 0;
      }
      // call displayModal function
      displayModal(counter);
    }

    if (e.target.classList.contains('fa-caret-left')) {
      if (counter > 0) {
        counter--;
      }
      else {
        counter = employees.length - 1;
      }
      // call displayModal function
      displayModal(counter);
    }
  })
}

// search Filter
searchInput.addEventListener('keyup', (e) => {
  const userValue = searchInput.value;
  const value = userValue.toLowerCase();
  const employees = gridContainer.querySelectorAll('.card');

  employees.forEach(employee => {
    let name = employee.querySelector('.name');
    if (name.textContent.toLowerCase().includes(value)) {
      employee.style.display = '';
    }
    else {
      employee.style.display = 'none';
    }
  })
})