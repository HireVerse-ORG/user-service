export default function (resetLink: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }
        h1 {
            color: #4640DE;
            text-align: center;
            font-size: 26px;
            margin-bottom: 10px;
        }
        p {
            font-size: 16px;
            line-height: 1.8;
            margin: 10px 0;
            color: #555;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            background-color: #4640DE;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #3b38c1;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            margin-top: 30px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #f4f7fc;
            color: #4640DE;
            font-size: 22px;
            font-weight: bold;
        }
        .support-link {
            color: #4640DE;
            text-decoration: none;
        }
        .support-link:hover {
            text-decoration: underline;
        }
    </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Hireverse</div>
            <h1>Password Reset Request</h1>
            <p>Hello,</p>
            <p>We have received a request to reset your password. To proceed, please click on the button below to set a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>If you did not request this, please ignore this email or contact support.</p>
            <p>Thank you for using Hireverse!</p>
            <div class="footer">
                <p>Need help? <a href="mailto:hireverseorg@gmail.com" class="support-link">Contact our support team</a>.</p>
            </div>
        </div>
    </body>
    </html>`;
}
