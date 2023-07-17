import dotenv from 'dotenv';

dotenv.config();

export default{
    persistence: process.env.PERSISTENCE,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
}