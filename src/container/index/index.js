export class Todo {
   static #NAME = 'todo'

   static #saveData = () => {
      localStorage.setItem(this.#NAME, JSON.stringify({
         list: this.#list,
         count: this.#count,
      }))
   }

   static #loadData = () => {
      const data = localStorage.getItem(this.#NAME)

      if (data) {
         const { list, count } = JSON.parse(data)
         this.#list = list
         this.#count = count
      }
   }

   static #list = []
   static #count = 0

   static #createTaskData = (text) => {
      this.#list.push({
         id: ++this.#count,
         text,
         done: false,
      })
   }

   static #block = null
   static #template = null
   static #input = null
   static #button = null

   static init = () => {
      // Викликати Todo.init() тільки після завантаження DOM
      document.addEventListener('DOMContentLoaded', () => {
         this.#template =
            document.getElementById(
               'task',
            ).content.firstElementChild
         this.#block = document.querySelector('.list')
         this.#input = document.querySelector('.form__input')
         this.#button = document.querySelector('.form__button')

         this.#button.onclick = this.#handleAdd

         this.#loadData()

         this.#render()
      })
   }

   static #handleAdd = () => {
      const value = this.#input.value
      if (value.length > 1) {
         this.#createTaskData(value)
         this.#input.value = ''
      } else {
         alert('add more text')
      }
      this.#render()
      this.#saveData()
   }

   static #render = () => {
      this.#block.innerHTML = ''

      if (this.#list.length === 0) {
         this.#block.innerText = `No tasks`
      } else {
         this.#list.forEach((taskData) => {
            const el = this.#createTaskElem(taskData)
            this.#block.append(el)
         })
      }
   }

   static #createTaskElem = (data) => {
      const elem = this.#template.cloneNode(true)

      const [id, text, btnDo, btnDel] = elem.querySelectorAll('.list__number, .list__text, .list__btn.do, .list__btn.del');

      id.innerText = `${data.id}.`
      text.innerText = data.text

      btnDel.onclick = this.#handleCancel(data)

      btnDo.onclick = this.#handleDo(data, btnDo, elem)

      if (data.done) {
         el.querySelector('.list__text').classList.add('list__item--done')
         btn.classList.remove('do')
         btn.classList.add('done')
      }

      return elem
   }

   static #handleDo = (data, btn, el) => () => {
      const result = this.#toggleDone(data.id)

      if (result === true || result === false) {
         el.querySelector('.list__text').classList.toggle('list__item--done')
         btn.classList.toggle('do')
         btn.classList.toggle('done')

         this.#saveData()
      }
   }

   static #toggleDone = (id) => {
      const task = this.#list.find((item) => item.id === id)

      if (task) {
         task.done = !task.done
         return task.done
      } else {
         return null
      }
   }

   // замикання
   static #handleCancel = (data) => () => {
      if (confirm(`Видалити ${data.text}?`)) {
         const result = this.#deleteById(data.id)
         // якщо видалення відбулося то визиваєм this.#render() щоб оновити наш список
         if (result) {
            this.#render()
            this.#saveData()
         }
      }
   }

   static #deleteById = (id) => {
      // оновлює list відфільтрувавши по id
      this.#list = this.#list.filter((item) => item.id !==id)
      // повертаєм true щоб розуміти що дія відбулася
      return true
   }
}

Todo.init()
// запишем щоб далі могти взаємодяти з нашим Todo через HTML чи через інші Js файли і мати доступ через window//і ще зробимо export щоб наш клас ще був доступніший і ми через import моглиб підключити....
window.todo = Todo
