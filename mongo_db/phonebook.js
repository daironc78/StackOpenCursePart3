const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://daironc78:${password}@cluster0.sptet.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    phone: Number,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length == 5 && process.argv.length > 3) {
    const name = process.argv[3].trim()
    const phone =process.argv[4].trim()

    if (!name || !phone || isNaN(phone)) {
      console.log('Name or phone number is missing, or phone number is not a number')
      process.exit(1)
    }

    const phonebook = new Phonebook({
      name: name,
      phone: phone,
    })

    phonebook.save().then(contact => {
        console.log('added, contact:', contact.name, '- number:', contact.phone, 'to phonebook')
        mongoose.connection.close()
    })
}
else {
    Phonebook.find({}).then(contacts => {
        console.log('phonebook:');
        
        contacts.forEach(contact => {
            console.log('contact:', contact.name, '- number:', contact.phone, 'to phonebook')
        })
        mongoose.connection.close()
    })
}