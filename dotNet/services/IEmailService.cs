using Sabio.Models.AppSettings;
using Sabio.Models.Requests;
using Sabio.Models.Requests.ContactUs;
using Sabio.Models.Domain.Stripe;
using Sabio.Models.Requests.Donations;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Requests.Users;
using Sabio.Models.Requests.Surveys;
using Sabio.Models.Requests.BecomeAMentor;
using Sabio.Models.Domain.EmailFaq;

namespace Sabio.Services
{
    public interface IEmailService
    {
        Task SendFaqQuestionToHost(EmailFaq model);
        Task SendFaqQuestionConfirmation(EmailFaq model);
        Task SendBecomeAMentorConfirmation(BecomeAMentor model);
        Task SendBecomeAMentorInitInfo(BecomeAMentor model);
        Task SendContactUsEmail(ContactAddRequest model);
        Task SendUserEmail(ContactAddRequest model);
        Task SendWelcomeEmail();
        Task SendResetPasswordEmail(ChangePasswordEmailRequest model);
        Task SendSurveyEmail(SurveyEmailRequest model);
        Task SendStripeEmail(CreateEmailRequest cust);
        Task SendDonationEmail(DonationEmailRequest cust);
    }
}
