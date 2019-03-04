(function (doc, $, ajax) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  function app() {

    function initEvents() {
      $('[data-js="carForm"]').on('submit', handleSubmit.bind(this));
    }

    function loadCompanyInfo() {
      ajax('/company.json').get(function (response) {
        $('[data-js="companyName"]').get().textContent = response.name;
        $('[data-js="companyPhone"]').get().textContent = response.phone;
      })
    }

    function handleSubmit(event) {
      event.preventDefault();
      this.saveCar(this.getFormInputs());
      this.refreshSavedCars();
    }

    function saveCar(jsonCar) {
      var success = function () {
        console.log('Car saved!');
      };
      var error = function () {
        console.log('Error while saving car.');
      };
      ajax('http://localhost:3000/car').post(jsonCar, success, error);
    }

    function loadSavedCars() {
      ajax('http://localhost:3000/car').get((function (jsonCars) {
        for (var index in jsonCars) {
          this.addRow(jsonCars[index]);
        }
      }).bind(this));
    }

    function resetTable() {
      var $tbody = $('[data-js="carTable"] tbody').get();
      while ($tbody.firstChild)
        $tbody.firstChild.remove();
    }

    function refreshSavedCars() {
      this.resetTable();
      this.loadSavedCars();
    }

    function getFormInputs() {
      return {
        image: $('[data-js=inputImage]').get().value,
        brandModel: $('[data-js=inputBrandModel]').get().value,
        year: $('[data-js=inputYear]').get().value,
        plate: $('[data-js=inputPlate]').get().value,
        color: $('[data-js=inputColor]').get().value
      };
    }

    function addRow(jsonCar) {
      var $tableBody = $('[data-js="carTable"] tbody').get();
      if ($tableBody.childElementCount > 0) {
        var newRowIndex = +$tableBody.lastElementChild.getAttribute('value') + 1;
      } else {
        var newRowIndex = 0;
      }
      $tableBody.appendChild(this.createRowFragment(jsonCar, newRowIndex));
    }

    function createRowFragment(jsonCar, rowIndex) {
      var $fragment = doc.createDocumentFragment();
      var $tr = doc.createElement('tr');
      $tr.setAttribute('value', rowIndex);
      Object.keys(jsonCar).forEach((function (field) {
        var $td = doc.createElement('td');
        if (field === 'image') {
          $td.appendChild(this.createCarImg(jsonCar[field]));
        } else {
          $td.textContent = jsonCar[field];
        }
        $tr.appendChild($td);
      }).bind(this));
      $tr.appendChild(this.getActionColumns(rowIndex));
      return $fragment.appendChild($tr);
    }

    function createCarImg(imgSrc) {
      var $fragment = doc.createDocumentFragment();
      var $img = doc.createElement('img');
      $img.setAttribute('src', imgSrc);
      return $fragment.appendChild($img);
    }

    function getActionColumns(rowIndex) {
      var $fragment = doc.createDocumentFragment();
      var $tdRemove = doc.createElement('td');
      $tdRemove.appendChild(this.createButtonRemove(rowIndex));
      return $fragment.appendChild($tdRemove);
    }

    function createButtonRemove(rowIndex) {
      var $button = doc.createElement('button');
      $button.setAttribute('data-js', 'carRemoveButton');
      $button.setAttribute('value', rowIndex);
      $button.innerHTML = '<p>Remover</p>';
      $button.addEventListener('click', (function () {
        this.removeCar($button.value);
      }).bind(this));
      return $button;
    }

    function removeCar(rowIndex) {
      ajax('http://localhost:3000/car').delete({plate: this.getCellText(rowIndex, 'plate')});
      this.removeRow(rowIndex);
    }

    function removeRow(rowIndex) {
      var $row = this.getRowElementByIndex(rowIndex);
      $row.remove();
    }

    function getRowElementByIndex(index) {
      return $('[data-js="carTable"] tbody tr[value="' + index + '"]').get();
    }

    function getCellText(rowIndex, field) {
      var $tds = this.getRowElementByIndex(rowIndex).childNodes;
      var collumIndex = this.getCollumnIndex(field);
      return $tds[collumIndex].innerText;
    }

    function getCollumnIndex(field) {
      var $ths = $('[data-js="carTable"] thead tr').get().children;
      for (var index in $ths) {
        if ($ths[index].getAttribute('data-js') === field) {
          return index;
        }
      } 
    }

    return {
      init: function () {
        this.initEvents();
        this.loadCompanyInfo();
        this.loadSavedCars();
      },
      initEvents: initEvents,
      loadCompanyInfo: loadCompanyInfo,
      handleSubmit: handleSubmit,
      saveCar: saveCar,
      refreshSavedCars: refreshSavedCars,
      resetTable: resetTable,
      loadSavedCars: loadSavedCars,
      getFormInputs: getFormInputs,
      addRow: addRow,
      createRowFragment: createRowFragment,
      createCarImg: createCarImg,
      getActionColumns: getActionColumns,
      createButtonRemove: createButtonRemove,
      removeCar: removeCar,
      removeRow: removeRow,
      getCellText: getCellText,
      getRowElementByIndex: getRowElementByIndex,
      getCollumnIndex: getCollumnIndex
    }
  }
  app().init();

})(document, window.DOM, window.AJAX);
