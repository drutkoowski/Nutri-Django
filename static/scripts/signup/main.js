const cardContent = document.querySelector('.signup__card__content')
const buttons = document.querySelectorAll("div.signup__card__content button");
const buttonBack = document.querySelector('.signup__card__buttons__button--back')
const buttonNext = document.querySelector('.signup__card__buttons__button--next')
const alertMsg = document.querySelector('.signup__card__alert')
const progressBar = document.querySelector('.progress-bar--active')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value
const modal = document.querySelector(".modal");

let iteration = 0
let choices = []
let currentChoice = null

const capitalize = (word) => {
    return word.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
}


const sendData = () => {
       // 0 - GOAL WEIGHT
    // 1 - ACTIVITY LEVEL
    // 2 - body parameter (cm)
    // 3 - body parameter (kg)
    //  4 - first name
    // 5 - last name
    // 6 - gender
    // 7 - years old
    // 8 - email address
    // 9 - username
    // 10 - password
    $.ajax({
        type: "POST",
        url: '',
        data: {
            'csrfmiddlewaretoken': csrfToken,
            'goal-weight': choices[0],
            'activity-level': choices[1],
            'body-cm': choices[2],
            'body-kg': choices[3],
            'first-name': capitalize(choices[4]),
            'last-name': capitalize(choices[5]),
            'gender': choices[6],
            'years-old': choices[7],
            'email': choices[8],
            'username': choices[9],
            'password': choices[10],
        },
        success: function (response){
            progressBar.classList.remove(`progress--${iteration}`)
            iteration += 1
            progressBar.classList.add(`progress--${iteration}`)
            modal.classList.remove('not-visible')

            setInterval(function () {
                window.location = window.location.origin + '/login';
            }, 4000);
            },
        error: function (error) {
            alertMsg.innerHTML = `Something went wrong, try again.`
            alertMsg.classList?.remove('not-visible')
        },
    })
}

function isEmpty(str) {
    return !str.trim().length;
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function clearQuestions(parent, children) {

    children.forEach((child) => {
        parent.removeChild(child)
    })
}

function clearAlerts() {
    alertMsg.innerHTML = ''
    alertMsg.classList.add('not-visible')
}

function getChildren(parent) {
    let arr = Array.from(parent.children);
    arr = arr.filter(function (el) {
        return !el.classList.contains('not-visible')
    })
    return arr
}


// const afterSignupSuccess = () => {
//   setTimeout(
//     function() {
//       alert('You signed up successfully.. now you will be redirected to login page.')
//     }, 5000);
//
// }



function appendContent(parent, iteration) {
    const arr = getChildren(parent)
    clearQuestions(parent,arr)
    let contentToAppend
    if (iteration === 0) {
        let currentHeading = document.querySelector('.signup__card__heading')
        currentHeading.innerHTML = "What's your weight goal?"
        contentToAppend = `
          <button id='gain-weight' class="signup__card__button">Gain Weight</button>
          <button id='maintain-weight' class="signup__card__button">Maintain Weight</button>
          <button id='lose-weight' class="signup__card__button">Lose Weight</button>`
    }
    if (iteration === 1) {
        let currentHeading = document.querySelector('.signup__card__heading')
        currentHeading.innerHTML = `What's your activity level?`
        contentToAppend = `
         <button id='not-active' class="signup__card__button">Not-active</button>
          <button id='lightly-active' class="signup__card__button">Lightly-active</button>
          <button id='active' class="signup__card__button">Active</button>
          <button id='very-active' class="signup__card__button">Very-active</button>`
    }

     if (iteration === 2) {
         let currentHeading = document.querySelector('.signup__card__heading')
         currentHeading.innerHTML = `What's your body parameters?`
         contentToAppend = `
         <div class="signup__card__input__container"><input id='tall' class="signup__card__input"/><span class="signup__card__input__span">cm</span></div>
         <div class="signup__card__input__container"><input id='weight' class="signup__card__input"/><span class="signup__card__input__span">kg</span></div>
          `
    }

     if (iteration === 3) {
        let currentHeading = document.querySelector('.signup__card__heading')
        currentHeading.style.fontSize = '3.5rem'
        currentHeading.innerHTML = `What's your name, birth year and gender?`
        contentToAppend = `
             <input id='first-name' class="signup__card__input" placeholder="First Name"/>
            
             <input id='last-name' class="signup__card__input" placeholder="Last Name"/>
            
             <div class="gender__container">
              <input type="radio" id="gender-men" name="gender" value="Male">
              <label class="gender__container__label" for="gender-men">Male</label>
            </div>
             <div class="gender__container">
               <input type="radio" id="gender-woman" name="gender" value="Female">
               <label class="gender__container__label" for="gender-woman">Female</label>
            </div>
           <label class="year" style="font-size: 2rem" for="year">How old are you?</label>
              <select class="year-select" name="year" id="year">
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
                <option value="47">47</option>
                <option value="48">48</option>
                <option value="49">49</option>
                <option value="50">50</option>
                <option value="51">51</option>
                <option value="52">52</option>
                <option value="53">53</option>
                <option value="54">54</option>
                <option value="55">55</option>
                <option value="56">56</option>
                <option value="57">57</option>
                <option value="58">58</option>
                <option value="59">59</option>
                <option value="60">60</option>
                <option value="61">61</option>
                <option value="62">62</option>
                <option value="63">63</option>
                <option value="64">64</option>
                <option value="65">65</option>
                <option value="66">66</option>
                <option value="67">67</option>
                <option value="68">68</option>
                <option value="69">69</option>
                <option value="70">70</option>
                <option value="71">71</option>
                <option value="72">72</option>
                <option value="73">73</option>
                <option value="74">74</option>
                <option value="75">75</option>
                <option value="76">76</option>
                <option value="77">77</option>
                <option value="78">78</option>
                <option value="79">79</option>
                <option value="80">80</option>
                <option value="81">81</option>
                <option value="82">82</option>
                <option value="83">83</option>
                <option value="84">84</option>
                <option value="85">85</option>
                <option value="86">86</option>
                <option value="87">87</option>
                <option value="88">88</option>
                <option value="89">89</option>
                <option value="90">90</option>
              </select>
             
          `
    }

     if (iteration === 4) {
        let currentHeading = document.querySelector('.signup__card__heading')
        currentHeading.innerHTML = `What's your email address and password?`
        contentToAppend = `
            <input id='email' type="email" class="signup__card__input" placeholder="Email Address" required/>
            <input id='username' type="text" class="signup__card__input" placeholder="Username" required/>
             <input id='password' type="password" class="signup__card__input" placeholder="Password" required/>
           
             
          `
    }
    parent.insertAdjacentHTML("afterbegin", contentToAppend)
     if (iteration < 2) {
         addListeners(parent)
    }

}

function resetButtons(buttons) {
    // loops through each card
    buttons.forEach(button => {
        // Makes the card and the button go to original look
        currentChoice = null
        // Change this to your own default colour for the card and button
        button.style.backgroundColor = "white";

        // Change button's text colour back to black (default)
        button.style.color = "black";
    });
}

function addListeners(parent) {
    const arr = Array.from(parent.children)

    arr.forEach(el => {
         el.addEventListener("click", e => {
            resetButtons(arr)
            currentChoice = e.target.id
            e.target.style.backgroundColor = "black";
            e.target.style.color = "white";
         });
    })
}

addListeners(cardContent)


buttonNext.addEventListener('click', e => {
        if(iteration < 2){
            if (currentChoice !== null) {
            alertMsg.classList?.add('not-visible')
            choices.push(currentChoice)
            currentChoice = null
            const parent = document.querySelector('.signup__card__content')
            progressBar.classList.remove(`progress--${iteration}`)
            iteration += 1
            progressBar.classList.add(`progress--${iteration}`)
            if(buttonBack.disabled === true) buttonBack.disabled = false
            appendContent(parent, iteration)
            clearAlerts()
            }
            else {
                alertMsg.innerHTML = `You have to choose one option.`
                alertMsg.classList.remove('not-visible')
                currentChoice = null
            }
        }
        else if (iteration === 2) {
            const tall = document.querySelector('#tall').value
            const weight = document.querySelector('#weight').value
            if (tall !== null && weight !== null && !isEmpty(tall) && !isEmpty(weight)){
                 if(tall < 230 && tall > 60 && weight > 30 && weight < 200){
                     choices.push(tall)
                     choices.push(weight)
                     const parent = document.querySelector('.signup__card__content')
                     progressBar.classList.remove(`progress--${iteration}`)
                     iteration += 1
                     progressBar.classList.add(`progress--${iteration}`)
                     if(buttonBack.disabled === true) buttonBack.disabled = false
                     appendContent(parent, iteration)
                     clearAlerts()
                 }
                 else {
                     alertMsg.innerHTML = `You have filled inputs incorrectly.`
                     alertMsg.classList?.remove('not-visible')
                 }

            }
            else {
                alertMsg.innerHTML = `You have fill the inputs.`
                alertMsg.classList?.remove('not-visible')

            }
        }
         else if (iteration === 3) {
            const firstName = document.querySelector('#first-name').value
            const lastName = document.querySelector('#last-name').value
            const yearsOld = document.querySelector(".year-select").value
            const gender = document.querySelector("input[type='radio'][name=gender]:checked")?.value;
            if (firstName !== null && lastName !== null && (gender === 'Male' || gender ==='Female') && !isEmpty(firstName) && !isEmpty(lastName) && (yearsOld > 5 && yearsOld < 91)) {
                if(firstName.length < 3 || lastName.length < 3)
                {
                    alertMsg.innerHTML = `You have filled incorrect name or last name field.`
                    alertMsg.classList?.remove('not-visible')
                }
                else {
                    choices.push(firstName)
                    choices.push(lastName)
                    choices.push(gender)
                    choices.push(yearsOld)
                    const parent = document.querySelector('.signup__card__content')
                    progressBar.classList.remove(`progress--${iteration}`)
                    iteration += 1
                    progressBar.classList.add(`progress--${iteration}`)
                    if(buttonBack.disabled === true) buttonBack.disabled = false
                    appendContent(parent, iteration)
                    clearAlerts()

                }

            }
            else {
                alertMsg.innerHTML = `You have filled inputs incorrectly.`
                alertMsg.classList?.remove('not-visible')
            }
        }

         else if (iteration === 4) {
             clearAlerts()
            const emailAddress = document.querySelector('#email').value
            const password = document.querySelector('#password').value
            const username = document.querySelector('#username').value
            if (emailAddress !== null && password !== null && username !== null && !isEmpty(emailAddress) && !isEmpty(username) && !isEmpty(password) && validateEmail(emailAddress)){
                 if(password.length < 4){
                     alertMsg.innerHTML = `Your password is too short!`
                     alertMsg.classList?.remove('not-visible')
                 }
                 if(password.length > 35){
                     alertMsg.innerHTML = `Your password is too long!`
                     alertMsg.classList?.remove('not-visible')
                 }
                 if (password.length >= 4 && password.length <= 35) {
                     choices.push(emailAddress)
                     choices.push(username)
                     choices.push(password)
                     // ajax call to check if desired username/email address is not taken
                     const getUrl = window.location.origin + '/data/check-if-taken'
                     $.ajax({
                        type: "GET",
                        url: getUrl,
                        data: {
                            'emailAddress': emailAddress,
                            'username': username,
                        },
                        success: function (response){
                            const status = response.status
                            if (status === 200) {
                                alertMsg.innerHTML = `User with these credentials already exists.`
                                choices = choices.slice(0, 8)
                                alertMsg.classList?.remove('not-visible')
                            }
                            else if (status === 404) {
                                 sendData()
                            }
                        },
                        error: function (error) {
                            alertMsg.innerHTML = `Something went wrong, try again.`
                            alertMsg.classList?.remove('not-visible')
                        },
                    })
                 }
                 else if (password.length < 4) {
                    alertMsg.innerHTML = `Your password is too short!`
                     alertMsg.classList?.remove('not-visible')
                 }
                 else if (password.length > 35) {
                    alertMsg.innerHTML = `Your password is too long!`
                     alertMsg.classList?.remove('not-visible')
                 }
            }

            else {
                alertMsg.innerHTML = `You have filled inputs incorrectly.`
                alertMsg.classList?.remove('not-visible')
            }
        }
})

buttonBack.addEventListener('click', (e) => {
    const parent = document.querySelector('.signup__card__content')
    const children = Array.from(parent.children)
    progressBar.classList.remove(`progress--${iteration}`)
    clearQuestions(parent, children)
    clearAlerts()
    if(iteration === 1) {
        choices = []
    }
    if(iteration === 2) {
        choices = choices[0]
    }

    if(iteration === 3) {
        choices = choices.slice(0, 2)
    }

    if(iteration === 4) {
        choices = choices.slice(0, 4)
    }

    if(iteration === 5) {
        choices = choices.slice(0, 9)
    }
    iteration = iteration - 1
    progressBar.classList.add(`progress--${iteration}`)
    appendContent(parent, iteration)
    if (iteration === 0 || iteration === 1) {
        addListeners()
    }
})

if (iteration < 1) {
    buttonBack.disabled = true
}
