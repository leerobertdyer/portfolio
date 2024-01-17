const contact = document.getElementById('contact')

const sender = document.getElementById('email')
const message = document.getElementById('message')
const submitForm = document.getElementById('submitForm')
submitForm.addEventListener('click', () => sendEmail())

const sendEmail = async() => {
    if (!sender.value || !message.value) {
        return
    }
    
    const popup = document.createElement('div')
    popup.className="popup"


    popup.addEventListener('click', () => {
        sender.value=""
        message.value=""
        popup.remove()
    })
    contact.appendChild(popup)
    const success = document.createElement('p')
    success.innerHTML="Thank you! <br/>Your message has been sent<br/><br/><span class='bigRedX'>X</span>"
    success.className="success"
    popup.appendChild(success)

    const resp = await fetch('https://portfolio-server-28r2.onrender.com/send-email', {
        method: "POST",
        headers: {"Content-Type": "Application/json"},
        body: JSON.stringify({
            senderEmail: sender.value,
            message: message.value
        })
    });
    if (resp.ok) {
        console.log('message sent');
    }
}