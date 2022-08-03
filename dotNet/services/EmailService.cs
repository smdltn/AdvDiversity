using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Sabio.Models.Requests;
using Sabio.Models.Requests.ContactUs;
using Sabio.Models.Domain.Stripe;
using Sabio.Models.Requests.Donations;
using Sabio.Models.Requests.Users;
using Sabio.Models.Requests.Surveys;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Sabio.Models.Requests.BecomeAMentor;
using Sabio.Models.Domain.EmailFaq;

namespace Sabio.Services
{
    public class EmailService : IEmailService
    {
        private AppKeys _appKeys;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private IConfiguration _config; 
        public EmailService(IOptions<AppKeys> appKeys, IWebHostEnvironment hostingEnvironment, IConfiguration config)
        {
            _appKeys = appKeys.Value;
            _hostingEnvironment = hostingEnvironment;
            _config = config; 
        }

        public async Task SendFaqQuestionToHost(EmailFaq model)
        {
            var from = new EmailAddress(_appKeys.ContactUs);
            var subject = $"Topic: {model.Subject}";
            var to = new EmailAddress(model.Email, model.FirstName);

            var plainTextContent =
                $"{model.FirstName} {model.LastName} submitted a question: \n " +
                $"* {model.FaqContent} \n" +
                $"\n Reply @: {model.Email} \n";

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, null);
            await Send(msg);
        }
        public async Task SendFaqQuestionConfirmation(EmailFaq model)
        {
            var from = new EmailAddress(_appKeys.ContactUs);
            var subject = $"The Institute to Advance Diversity - You submitted a question with subject: {model.Subject}";
            var to = new EmailAddress(model.Email, model.FirstName);

            var plainTextContent =
                $"Thank you {model.FirstName} for submitting a question to us. The question you have submitted is \n" +
                $"\n * {model.FaqContent} \n" +
                $"\n One of our staff will reach out to you in the near future. \n";

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, null);
            await Send(msg);
        }
        public async Task SendBecomeAMentorConfirmation(BecomeAMentor model)
        {
            var from = new EmailAddress("sendwelcomeemail@dispostable.com");
            var subject = model.FirstName + " " + model.LastName + ", Welcome to Advance Diversity";
            var to = new EmailAddress(model.Email, model.FirstName);

            string path = Path.Combine(_hostingEnvironment.WebRootPath, "EmailTemplates", "BecomeAMentorWelcomeEmail.html");
            var htmlContent = File.ReadAllText(path);

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlContent);
            await Send(msg);
        }

        public async Task SendBecomeAMentorInitInfo(BecomeAMentor model)
        {
            var from = new EmailAddress("sendwelcomeemail@dispostable.com");
            var subject = "Become A Mentor Interest - " + model.FirstName + " " + model.LastName;
            var to = new EmailAddress(model.Email, model.FirstName);

            var plainTextContent = 
                $"{model.FirstName} {model.LastName} submitted info to {model.PurposeRadio} \n " +
                $"- Contact: {model.Phone} \n" +
                $"- Email: {model.Email} \n " +
                $"- With phone, can be: {JsonConvert.SerializeObject(model.PhoneCheckBoxes)} \n " +
                $"- Mentorship base: {JsonConvert.SerializeObject(model.CheckBoxes)} \n " +
                $"- Maximum distance: {model.DistanceId} miles";

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, null);
            await Send(msg);
        }

        public async Task SendContactUsEmail(ContactAddRequest model)
        {
            var from = new EmailAddress(_appKeys.ContactUs, "Fname Lname");

            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress(_appKeys.ContactUs, "Fname Lname");

            var plainTextContent = "Contact Form";

            string path = Path.Combine(_hostingEnvironment.WebRootPath, "EmailTemplates", "ContactUsEmail.html");

            var htmlContent = File.ReadAllText(path);

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await Send(msg);

        }

        public async Task SendUserEmail(ContactAddRequest model)
        {
            var from = new EmailAddress(_appKeys.ContactUs, "Fname Lname");
            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress(model.Email, "Fname Lname");
            var plainTextContent = "Thanks For Contacting Us";

            string path = Path.Combine(_hostingEnvironment.WebRootPath, "EmailTemplates", "ContactUsEmail.html");

            var htmlContent = File.ReadAllText(path);

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await Send(msg);

        }


        public async Task SendWelcomeEmail()
        {
            var from = new EmailAddress("sendwelcomeemail@dispostable.com", "Fname Lname");
            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress("sendwelcomeemail@dispostable.com", "Fname Lname");
            var plainTextContent = "and easy to do anywhere, even with C#";

            string path = Path.Combine(_hostingEnvironment.WebRootPath, "EmailTemplates", "WelcomeEmail.html");

            var htmlContent = File.ReadAllText(path);

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await Send(msg);

        }

        public async Task SendStripeEmail(CreateEmailRequest cust)
        {
            var from = new EmailAddress("sendwelcomeemail@dispostable.com");
            var subject = "Thank you for your purchase " + cust.CustomerName;
            var to = new EmailAddress(cust.CustomerEmail, cust.CustomerName);
            var totalAmount = cust.AmountTotal / 100 + ".00";
            var plainTextContent = "Thank you for your purchase!" 
                + " The Total Amount is " 
                + totalAmount 
                + ". Payment Status " + cust.PaymentStatus 
                + " Your Transaction Id is " + cust.TransactionId;

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, null);
            await Send(msg);
        }
        public async Task SendDonationEmail(DonationEmailRequest cust)
        {
            var from = new EmailAddress("sendwelcomeemail@dispostable.com", "Fname Lname");
            var subject = "Thank you for your purchase " + cust.FirstName;
            var to = new EmailAddress(cust.Email, cust.FirstName);
            var plainTextContent = "Thank you for your donation of " + cust.Amount + cust.Currency + ". Your Transaction ID is " + cust.PaymentId;
            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, null);
            await Send(msg);
        }  

        public async Task SendResetPasswordEmail(ChangePasswordEmailRequest model)
        {
            var from = new EmailAddress("advdiversity@dispostable.com");
            var subject = " Reset Password ";
            var to = new EmailAddress(model.Email);
            string url = String.Concat("/changepassword?token=", model.Token + "&email=", model.Email);
            var plainTextContent = "Please Click here ==> " + url;
            string path = Path.Combine(_hostingEnvironment.WebRootPath, "EmailTemplates", "ResetPasswordEmail.html");
            string pathName = "/changepassword?";
            string token = "token=" + model.Token;
            string email = "&email=" + model.Email;
            string domain = _config.GetSection("Domain").Value;

            var htmlContent = File.ReadAllText(path).Replace("{{$Domain}}", domain)
                                                    .Replace("{{$Path}}", pathName)
                                                    .Replace("{{$Token}}", token)
                                                    .Replace("{{$Email}}", email);
            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await Send(msg);
        }
        public async Task SendSurveyEmail(SurveyEmailRequest model)
        {
            var from = new EmailAddress("advdiversity@dispostable.com");
            var subject = "Survey Form";
            var to = new EmailAddress(model.Email);
            var plainTextContent = "Thank you for your feedback, " + model.FullName + "!";
            string path = Path.Combine(_hostingEnvironment.WebRootPath, "EmailTemplates", "SurveySubmissionEmail.html");
            string domain = _config.GetSection("Domain").Value;

            var htmlContent = File.ReadAllText(path).Replace("{{$Domain}}", domain)
                                                    .Replace("{{$Path}}", model.Path);
            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await Send(msg);
        }

        public async Task<Response> Send(SendGridMessage msg)
        {
            Response response = null;
            SendGridClient client = new SendGridClient(_appKeys.SendGridAppKey);

            response = await client.SendEmailAsync(msg);

            if (response.StatusCode != System.Net.HttpStatusCode.Accepted)
            {
                throw new Exception(response.ToString());
            }
            return response;

        }


    }
}
