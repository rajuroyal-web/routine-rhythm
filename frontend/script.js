let currentDate = new Date().toISOString().split('T')[0];
let data = {};
let isEditMode = false;
const password = '@The_yuvaraj';

const API_URL = 'https://routine-rhythm.onrender.com/api/data';
const USER_ID = 'default-user';

async function fetchData(date) {
  try {
    const response = await fetch(`${API_URL}/${USER_ID}/${date}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fetchedData = await response.json();
    return fetchedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    alert(`Error fetching data: ${error.message}`);
    return {};
  }
}

async function saveDataToServer(date, data) {
  try {
    const response = await fetch(`${API_URL}/${USER_ID}/${date}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const savedData = await response.json();
    return savedData;
  } catch (error) {
    console.error('Error saving data:', error);
    alert(`Error saving data: ${error.message}`);
    return null;
  }
}

async function renderAll() {
  try {
    const fetchedData = await fetchData(currentDate);
    data[currentDate] = fetchedData;
    
    document.getElementById('dateInput').value = currentDate;
    
    const renderFunctions = [
      { name: 'renderMood', func: renderMood },
      { name: 'renderEnergyLevel', func: renderEnergyLevel },
      { name: 'renderWeather', func: renderWeather },
      { name: 'renderSleepSchedule', func: renderSleepSchedule },
      { name: 'renderTodoList', func: renderTodoList },
      { name: 'renderMotivation', func: renderMotivation },
      { name: 'renderGoals', func: renderGoals },
      { name: 'renderExpenseTracker', func: renderExpenseTracker },
      { name: 'renderHabits', func: renderHabits },
      { name: 'renderWaterIntake', func: renderWaterIntake },
      { name: 'renderNotes', func: renderNotes },
      { name: 'renderMeals', func: renderMeals },
      { name: 'updateEditableState', func: updateEditableState },
      { name: 'renderCalendar', func: renderCalendar },
      { name: 'updateNoteButtonState', func: updateNoteButtonState },
      { name: 'showNoteOnVisit', func: showNoteOnVisit }
    ];

    for (const { name, func } of renderFunctions) {
      try {
        func();
      } catch (error) {
        console.error(`Error in ${name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error rendering data:', error);
    alert(`Error rendering data: ${error.message}`);
  }
}

function updateEditableState() {
  const editableElements = document.querySelectorAll('input:not([type="date"]), textarea, select, .addMeal, #addTodo, #addGoal, #addTransaction');
  editableElements.forEach(el => {
    el.disabled = !isEditMode;
  });
  document.getElementById('saveButton').disabled = !isEditMode;
}

function setMood(mood) {
  if (isEditMode) {
    if (!data[currentDate]) data[currentDate] = {};
    data[currentDate].mood = mood;
    renderMood();
  }
}

function renderMood() {
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mood === data[currentDate]?.mood);
  });
}

function setEnergyLevel(level) {
  if (isEditMode) {
    if (!data[currentDate]) data[currentDate] = {};
    data[currentDate].energyLevel = level;
    renderEnergyLevel();
  }
}

function renderEnergyLevel() {
  document.querySelectorAll('.energy-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.energy <= (data[currentDate]?.energyLevel || 0));
  });
}

function setWeather(weather) {
  if (isEditMode) {
    if (!data[currentDate]) data[currentDate] = {};
    data[currentDate].weather = weather;
    renderWeather();
  }
}

function renderWeather() {
  document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.weather === data[currentDate]?.weather);
  });
}

function renderSleepSchedule() {
  document.getElementById('wakeTime').value = data[currentDate]?.wakeTime || '';
  document.getElementById('sleepTime').value = data[currentDate]?.sleepTime || '';
}

function addTodo() {
  if (isEditMode) {
    if (!data[currentDate]) data[currentDate] = {};
    if (!data[currentDate].todos) data[currentDate].todos = [];
    data[currentDate].todos.push({ text: '', completed: false });
    renderTodoList();
  }
}

function renderTodoList() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  data[currentDate]?.todos?.forEach((todo, index) => {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item d-flex align-items-center mb-2';
    todoItem.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''} class="form-check-input me-2">
      <input type="text" value="${todo.text}" placeholder="Enter task..." class="form-control me-2">
      <button class="btn btn-danger btn-sm">Delete</button>
    `;
    todoItem.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      if (isEditMode) {
        data[currentDate].todos[index].completed = e.target.checked;
      }
    });
    todoItem.querySelector('input[type="text"]').addEventListener('input', (e) => {
      if (isEditMode) {
        data[currentDate].todos[index].text = e.target.value;
      }
    });
    todoItem.querySelector('button').addEventListener('click', () => {
      if (isEditMode) {
        data[currentDate].todos.splice(index, 1);
        renderTodoList();
      }
    });
    todoList.appendChild(todoItem);
  });
}

function renderMotivation() {
  document.getElementById('motivation').value = data[currentDate]?.motivation || '';
}

function addGoal() {
  if (isEditMode) {
    if (!data[currentDate]) data[currentDate] = {};
    if (!data[currentDate].goals) data[currentDate].goals = [];
    data[currentDate].goals.push({ text: '', completed: false });
    renderGoals();
  }
}

function renderGoals() {
  const goalList = document.getElementById('goalList');
  goalList.innerHTML = '';
  data[currentDate]?.goals?.forEach((goal, index) => {
    const goalItem = document.createElement('div');
    goalItem.className = 'goal-item d-flex align-items-center mb-2';
    goalItem.innerHTML = `
      <input type="checkbox" ${goal.completed ? 'checked' : ''} class="form-check-input me-2">
      <input type="text" value="${goal.text}" placeholder="Enter goal..." class="form-control me-2">
      <button class="btn btn-danger btn-sm">Delete</button>
    `;
    goalItem.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      if (isEditMode) {
        data[currentDate].goals[index].completed = e.target.checked;
      }
    });
    goalItem.querySelector('input[type="text"]').addEventListener('input', (e) => {
      if (isEditMode) {
        data[currentDate].goals[index].text = e.target.value;
      }
    });
    goalItem.querySelector('button').addEventListener('click', () => {
      if (isEditMode) {
        data[currentDate].goals.splice(index, 1);
        renderGoals();
      }
    });
    goalList.appendChild(goalItem);
  });
}

function addTransaction() {
  if (isEditMode) {
    const type = document.getElementById('transactionType').value;
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;

    if (category && amount) {
      if (!data[currentDate]) data[currentDate] = {};
      if (!data[currentDate].transactions) data[currentDate].transactions = [];
      data[currentDate].transactions.push({ type, category, amount, description });
      renderExpenseTracker();
      
      document.getElementById('category').value = '';
      document.getElementById('amount').value = '';
      document.getElementById('description').value = '';
    }
  }
}

function renderExpenseTracker() {
  const transactionList = document.getElementById('transactionList');
  transactionList.innerHTML = '';
  let balance = 0;

  data[currentDate]?.transactions?.forEach((transaction, index) => {
    const transactionItem = document.createElement('div');
    transactionItem.className = `transaction-item d-flex justify-content-between align-items-center mb-2 ${transaction.type}`;
    transactionItem.innerHTML = `
      <div>
        <strong>${transaction.category}</strong>
        <small class="text-muted d-block">${transaction.description}</small>
      </div>
      <div class="d-flex align-items-center">
        <span class="me-2 ${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
          ${transaction.type === 'income' ? '+' : '-'}$${parseFloat(transaction.amount).toFixed(2)}
        </span>
        <button class="btn btn-danger btn-sm">Delete</button>
      </div>
    `;
    transactionItem.querySelector('button').addEventListener('click', () => {
      if (isEditMode) {
        data[currentDate].transactions.splice(index, 1);
        renderExpenseTracker();
      }
    });
    transactionList.appendChild(transactionItem);

    balance += transaction.type === 'income' ? parseFloat(transaction.amount) : -parseFloat(transaction.amount);
  });

  const balanceElement = document.getElementById('balance');
  balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
  balanceElement.className = balance >= 0 ? 'text-success' : 'text-danger';
}

function renderHabits() {
  const habitList = document.getElementById('habitList');
  habitList.innerHTML = '';
  
  const defaultHabits = ['Read', 'Exercise', 'Meditate'];
  defaultHabits.forEach((habit, index) => {
    const habitItem = document.createElement('div');
    habitItem.className = 'form-check';
    habitItem.innerHTML = `
      <input class="form-check-input" type="checkbox" id="habit-${index}" ${data[currentDate]?.habits?.[index] ? 'checked' : ''}>
      <label class="form-check-label" for="habit-${index}">${habit}</label>
    `;
    habitItem.querySelector('input').addEventListener('change', (e) => {
      if (isEditMode) {
        if (!data[currentDate]) data[currentDate] = {};
        if (!data[currentDate].habits) data[currentDate].habits = [];
        data[currentDate].habits[index] = e.target.checked;
      }
    });
    habitList.appendChild(habitItem);
  });
}

function renderWaterIntake() {
  const waterIntake = document.getElementById('waterIntake');
  waterIntake.innerHTML = '';
  
  for (let i = 0; i < 8; i++) {
    const waterButton = document.createElement('button');
    waterButton.className = `btn btn-outline-primary ${data[currentDate]?.waterIntake?.[i] ? 'active' : ''}`;
    waterButton.innerHTML = '<i class="fas fa-tint"></i>';
    waterButton.addEventListener('click', () => {
      if (isEditMode) {
        if (!data[currentDate]) data[currentDate] = {};
        if (!data[currentDate].waterIntake) data[currentDate].waterIntake = Array(8).fill(false);
        data[currentDate].waterIntake[i] = !data[currentDate].waterIntake[i];
        renderWaterIntake();
      }
    });
    waterIntake.appendChild(waterButton);
  }
}

function renderNotes() {
  document.getElementById('notes').value = data[currentDate]?.notes || '';
}

function addMeal(mealType) {
  if (isEditMode) {
    if (!data[currentDate]) data[currentDate] = {};
    if (!data[currentDate].meals) data[currentDate].meals = {};
    if (!data[currentDate].meals[mealType]) data[currentDate].meals[mealType] = [];
    data[currentDate].meals[mealType].push('');
    renderMeals();
  }
}

function renderMeals() {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
  mealTypes.forEach(mealType => {
    const mealList = document.getElementById(`${mealType}Items`);
    mealList.innerHTML = '';
    data[currentDate]?.meals?.[mealType]?.forEach((meal, index) => {
      const mealItem = document.createElement('div');
      mealItem.className = 'meal-item d-flex align-items-center mb-2';
      mealItem.innerHTML = `
        <input type="text" value="${meal}" placeholder="Enter meal..." class="form-control me-2">
        <button class="btn btn-danger btn-sm">Delete</button>
      `;
      mealItem.querySelector('input').addEventListener('input', (e) => {
        if (isEditMode) {
          data[currentDate].meals[mealType][index] = e.target.value;
        }
      });
      mealItem.querySelector('button').addEventListener('click', () => {
        if (isEditMode) {
          data[currentDate].meals[mealType].splice(index, 1);
          renderMeals();
        }
      });
      mealList.appendChild(mealItem);
    });
  });
}

async function saveData() {
  if (isEditMode) {
    try {
      const savedData = await saveDataToServer(currentDate, data[currentDate]);
      if (savedData) {
        alert('Data saved successfully!');
        isEditMode = false;
        updateEditableState();
        renderCalendar();
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert(`Error saving data: ${error.message}`);
    }
  }
}

function showPasswordModal() {
  const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
  passwordModal.show();
}

function checkPassword() {
  const enteredPassword = document.getElementById('passwordInput').value;
  if (enteredPassword === password) {
    isEditMode = true;
    updateEditableState();
    const passwordModal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
    passwordModal.hide();
  } else {
    alert('Incorrect password. Please try again.');
  }
}

async function changeDate(date) {
  currentDate = date;
  await renderAll();
}

function prevDay() {
  const prevDate = new Date(currentDate);
  prevDate.setDate(prevDate.getDate() - 1);
  changeDate(prevDate.toISOString().split('T')[0]);
}

function nextDay() {
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  changeDate(nextDate.toISOString().split('T')[0]);
}

async function renderCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = '';

  const calendar = document.createElement('div');
  calendar.className = 'calendar';

  const currentMonth = new Date(currentDate).getMonth();
  const currentYear = new Date(currentDate).getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  calendar.innerHTML = `
    <div class="calendar-header">
      <button class="btn btn-sm btn-outline-secondary" id="prevMonth">&lt;</button>
      <h3>${monthNames[currentMonth]} ${currentYear}</h3>
      <button class="btn btn-sm btn-outline-secondary" id="nextMonth">&gt;</button>
    </div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </tr>
      </thead>
      <tbody id="calendarBody"></tbody>
    </table>
  `;

  calendarContainer.appendChild(calendar);

  const calendarBody = document.getElementById('calendarBody');

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay.getDay()) {
        row.appendChild(document.createElement('td'));
      } else if (date > lastDay.getDate()) {
        break;
      } else {
        const cell = document.createElement('td');
        cell.textContent = date;
        const cellDate = new Date(currentYear, currentMonth, date).toISOString().split('T')[0];
        if (cellDate === currentDate) {
          cell.classList.add('bg-primary', 'text-white');
        }
        cell.addEventListener('click', () => changeDate(cellDate));
        row.appendChild(cell);
        date++;
      }
    }
    calendarBody.appendChild(row);
  }

  document.getElementById('prevMonth').addEventListener('click', () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    changeDate(newDate.toISOString().split('T')[0]);
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    changeDate(newDate.toISOString().split('T')[0]);
  });
}

function updateNoteButtonState() {
  const noteButton = document.getElementById('noteHighlight');
  const noteBadge = document.getElementById('noteBadge');
  
  if (data[currentDate]?.notes && data[currentDate].notes.trim() !== '') {
    noteButton.classList.add('has-note');
    noteBadge.style.display = 'block';
  } else {
    noteButton.classList.remove('has-note');
    noteBadge.style.display = 'none';
  }
}

function showNoteOnVisit() {
  const noteCard = document.getElementById('noteCard');
  const noteContent = document.getElementById('noteContent');
  
  if (data[currentDate]?.notes && data[currentDate].notes.trim() !== '') {
    noteContent.textContent = data[currentDate].notes;
    noteCard.style.display = 'block';
    setTimeout(() => {
      noteCard.classList.add('show');
    }, 100);
    setTimeout(() => {
      noteCard.classList.remove('show');
      setTimeout(() => {
        noteCard.style.display = 'none';
      }, 300);
    }, 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => setMood(btn.dataset.mood));
  });

  document.querySelectorAll('.energy-btn').forEach(btn => {
    btn.addEventListener('click', () => setEnergyLevel(btn.dataset.energy));
  });

  document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.addEventListener('click', () => setWeather(btn.dataset.weather));
  });

  document.getElementById('wakeTime').addEventListener('change', (e) => {
    if (isEditMode) {
      if (!data[currentDate]) data[currentDate] = {};
      data[currentDate].wakeTime = e.target.value;
    }
  });

  document.getElementById('sleepTime').addEventListener('change', (e) => {
    if (isEditMode) {
      if (!data[currentDate]) data[currentDate] = {};
      data[currentDate].sleepTime = e.target.value;
    }
  });

  document.getElementById('addTodo').addEventListener('click', addTodo);

  document.getElementById('motivation').addEventListener('input', (e) => {
    if (isEditMode) {
      if (!data[currentDate]) data[currentDate] = {};
      data[currentDate].motivation = e.target.value;
    }
  });

  document.getElementById('addGoal').addEventListener('click', addGoal);

  document.getElementById('addTransaction').addEventListener('click', addTransaction);

  document.getElementById('notes').addEventListener('input', (e) => {
    if (isEditMode) {
      if (!data[currentDate]) data[currentDate] = {};
      data[currentDate].notes = e.target.value;
    }
  });

  document.querySelectorAll('.addMeal').forEach(btn => {
    btn.addEventListener('click', () => addMeal(btn.dataset.meal));
  });

  document.getElementById('saveButton').addEventListener('click', saveData);
  document.getElementById('editButton').addEventListener('click', showPasswordModal);
  document.getElementById('submitPassword').addEventListener('click', checkPassword);

  document.getElementById('dateInput').addEventListener('change', (e) => changeDate(e.target.value));
  document.getElementById('prevDay').addEventListener('click', prevDay);
  document.getElementById('nextDay').addEventListener('click', nextDay);

  document.getElementById('noteHighlight').addEventListener('click', () => {
    const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
    document.getElementById('modalNoteContent').textContent = data[currentDate]?.notes || 'No note for today.';
    noteModal.show();
  });
});