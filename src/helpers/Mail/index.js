//process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_API_KEY

import { http } from "../http";

export async function sendEmail() {
  const data = {
    Messages: [
      {
        From: {
          Email: "no-reply@mangabase.tk",
          Name: "No contestar a este correo.",
        },
        To: [
          {
            Email: "tomeupau01@gmail.com",
            Name: "You",
          },
        ],
        Subject: "My first Mailjet Email!",
        TextPart: "Greetings from Mailjet!",
        HTMLPart: '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet!</a></h3><br />May the delivery force be with you!',
      },
    ],
  };
  const mail = await http.post("https://api.mailjet.com/v3.1/send", data, { auth: { username: process.env.REACT_APP_MJ_APIKEY_PUBLIC, password: process.env.REACT_APP_MJ_APIKEY_PRIVATE } });
  console.log("Mail", mail);
}
