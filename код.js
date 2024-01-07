const fs = require('fs');

// Функция для чтения данных из текстового файла
function readDataFromFile() {
  try {
    const data = fs.readFileSync('database.txt', 'utf-8');
    return data.split('\n').map(row => row.split(','));
  } catch (error) {
    console.error('Ошибка чтения файла:', error.message);
    return [];
  }
}

// Функция для записи данных в текстовый файл
function writeDataToFile(data) {
  try {
    const formattedData = data.map(row => row.join(',')).join('\n');
    fs.writeFileSync('database.txt', formattedData, 'utf-8');
  } catch (error) {
    console.error('Ошибка записи файла:', error.message);
  }
}

// Функция для поиска посылки
function searchPackage(code) {
  var data = readDataFromFile();
  var result = { message: "Данный трек-код еще не был зарегистрирован", statuses: [] };

  var lastActiveStatusColor = null;
  var lastActiveStatusNumber = null;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == code) {
      var statuses = [];

      for (var j = 1; j <= 12; j++) {
        var statusValue = data[i][j];
        if (statusValue) {
          var statusName = getStatusName(j);
          var statusColor;

          if (statusValue === "Нет данных") {
            statusColor = lastActiveStatusColor || "default";
          } else {
            statusColor = getStatusColor(j);
            lastActiveStatusColor = statusColor;
            lastActiveStatusNumber = j;
          }

          statuses.push({ name: statusName, value: statusValue, color: statusColor });
        }
      }

      // Устанавливаем последний активный статус цветом для всех статусов
      statuses.forEach(function(status) {
        status.color = getStatusColor(lastActiveStatusNumber);
      });

      result = { message: null, statuses: statuses };
      break;
    }
  }

  return result;
}

// Функция для добавления новых значений
function addNewValues(valuesArray) {
  var data = readDataFromFile();
  var nextRow = data.length + 1;

  for (var i = 0; i < valuesArray.length; i++) {
    data.push([valuesArray[i][0], getCurrentDateTime(), "Нет данных", "Нет данных"]);
  }

  writeDataToFile(data);
}

// Остальные функции остаются без изменений

// Функция для получения цвета статуса
function getStatusColor(statusNumber) {
  switch (statusNumber) {
    case 1:
      return "orange";
    case 2:
      return "green";
    case 3:
    case 4:
      return "blue";
    default:
      return "default";
  }
}

// Функция для получения названия статуса
function getStatusName(statusNumber) {
  switch (statusNumber) {
    case 1:
      return "Товар прибыл на склад Китая";
    case 2:
      return "Товар прибыл на склад Алматы";
    case 3:
      return "Отправлен в ваш город";
    case 4:
      return "Выдан клиенту";
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      return ".";
    default:
      return ".";
  }
}

// Функция для получения текущей даты и времени
function getCurrentDateTime() {
  var now = new Date();
  return Utilities.formatDate(now, "Asia/Almaty", "dd.MM.yyyy в HH:mm:ss");
}
