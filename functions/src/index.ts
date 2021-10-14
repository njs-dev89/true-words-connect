const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.addTranslatorRole = functions.https.onCall((data: Record<string, unknown>)=> {
  
    return admin.auth().setCustomUserClaims(data.uid, {role: "translator"}).then(()=> {
      return {
        message: "Translator Added"
      }
    }).catch((e: Record<string, unknown>)=> {
      return e
    })
 
})

exports.addClientRole = functions.https.onCall((data: Record<string, unknown>)=> {
  
  return admin.auth().setCustomUserClaims(data.uid, {role: "client"}).then(()=> {
    return {
      message: "Client Added"
    }
  }).catch((e: Record<string, unknown>)=> {
    return e
  })

})

exports.addAdminRole = functions.https.onCall((data: Record<string, unknown>)=> {
  
  return admin.auth().setCustomUserClaims(data.uid, {role: "admin"}).then(()=> {
    return {
      message: "Client Added"
    }
  }).catch((e: Record<string, unknown>)=> {
    return e
  })

})
