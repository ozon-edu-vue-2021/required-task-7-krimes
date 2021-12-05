"use strict";

let data = [];
let contractEl;

const loadData = async function () {
  let url = '/data.json';

  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    throw err;
  }
}

//render
const renderPage = function (page) {
  const container = document.querySelector('#container')

  if (page === 'people') {
    renderContactsStyle(true)
    renderContactPeopleStyle(true)
    container.classList.add('details')
  } else {
    renderContactsStyle(false)
    renderContactPeopleStyle(false)
    container.classList.remove('details')
  }
}

const renderContactsStyle = function (clearStyle = false) {
  const contactsListEl = document.querySelector('.list-view > .contacts-list');
  const list = contactsListEl.children;

  for (let index = 0; index < list.length; index++) {
    const itemStyle = `translate3d(0, ${index * 70}px, 0)`;
    list.item(index).style.transform = !clearStyle ? itemStyle : '';
  }
}

const renderContacts = function () {
  const fragment = document.createDocumentFragment();

  data.forEach((contact, index) => {
    const item = document.createElement('li');
    item.setAttribute('contact-id', contact.id);
    item.innerHTML = `<strong>${contact.name}</strong>`;
    fragment.appendChild(item);
  })

  return fragment;
}

const renderContactPeopleStyle = function (clearStyle = false) {
  const contacts = document.querySelector('#people-list');
  const list = contacts.children;

  for (let index = 0; index < list.length; index++) {
    if (clearStyle) {
      list.item(index).style.transform = '';
    } else {
      const offsetY = index * 5;
      const offsetStart = 0.02 * index;
  
      list.item(index).style.transform = `translate3d(0, ${offsetY}px, 0)`
      list.item(index).style.webkitTransform = `translate3d(0, ${offsetY}px, 0)`
      list.item(index).style.transition += `transform 0.3s ${offsetStart}s`
      list.item(index).style.transition += `transform 0.3s ${offsetStart}s, -webkit-transform 0.3s ${offsetStart}s`
      list.item(index).style.transition = `-webkit-transform 0.3s ${offsetStart}s`
      list.item(index).style.webkitTransition = `-webkit-transform 0.3s ${offsetStart}s`
    }
  }
}

const renderContactPeople = function (contact) {
  const fragment = document.createDocumentFragment();

  const parts = [
    { 
      title: 'Друзья', 
      query: () => data
        .filter(it => contact.friends.includes(it.id))
        /*.sort((a,b) => a.name.localeCompare(b.name))*/
        .slice(0, 3) 
    },
    { 
      title: 'Не в друзьях',
      query: () => data
        .filter(it => (it.id !== contact.id) && !contact.friends.includes(it.id))
        /*.sort((a,b) => a.name.localeCompare(b.name))*/
        .slice(0, 3) 
    },
    { 
      title: 'Популярные люди', 
      query: () => data
        // 1 Вариант: Когда выбираем по всем людям у кого больше друзей
        .map(it => ({...it, count: data.filter(d => d.friends.includes(it.id)).length }))
        // 2 Вариант: Когда выбираем по друзьям этого человека у кого больше друзей (добавление 1 фильтра)
        // .filter(it => contact.friends.includes(it.id))
        // .map(it => ({...it, count: data.filter(d => d.friends.includes(it.id)).length }))
        // конец 2 варианта
        // 3 Вариант: Когда выбираем по не друзьям этого человека у кого больше друзей (добавление 2 фильтра)
        // .filter(it => (it.id !== contact.id) && !contact.friends.includes(it.id))
        // .map(it => ({...it, count: data.filter(d => d.friends.includes(it.id)).length }))
        // конец 3 варианта
        .sort((a,b) => b.count - a.count)
        .slice(0, 3) 
        .sort((a,b) => a.count === b.count ? a.name.localeCompare(b.name) : 0)
    }
  ];

  parts.forEach((part, partIndex) => {
    const people = part.query()
    const itemTitle = document.createElement('li');

    itemTitle.classList.add('people-title')
    itemTitle.textContent = part.title;
    fragment.appendChild(itemTitle);

    people.forEach((item, index) => {
      const itemEl = document.createElement('li');
      
      itemEl.innerHTML = `<i class="fa fa-male"></i><span >${item.name}</span>`;
      fragment.appendChild(itemEl);
    })
  })

  return fragment;
}

//handler
const onClickContact = function (el) {
  contractEl = el.target;
  contractEl.classList.add('active')
  const contactId = contractEl.getAttribute('contact-id');
  const contact = data.find(it => it.id === Number(contactId))

  renderPage('people')
  
  const contacts = document.querySelector('#people-list');
  
  contacts.innerHTML = '';

  contacts.appendChild(renderContactPeople(contact));
}

;(async function() {
  const contactsListEl = document.querySelector('.list-view > .contacts-list');
  const backToContact = document.querySelector('.details-view > .back');
  data = await loadData();

  //render initial contacts list 
  const fragmentContacts = renderContacts()
  contactsListEl.appendChild(fragmentContacts)
  renderContactsStyle()

  // handler
  backToContact.addEventListener('click', () => {
    contractEl.classList.remove('active')
    renderPage('contacts')
  })

  const contacts = contactsListEl.querySelectorAll('li');
  contacts.forEach(contact => {
    contact.addEventListener('click', onClickContact)
  });


})();
