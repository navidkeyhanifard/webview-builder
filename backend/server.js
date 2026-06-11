const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/build', async (req, res) => {
    try {
        const { 
            appName, 
            version, 
            packageName, 
            websiteUrl, 
            iconUrl, 
            splashUrl, 
            firebaseServerKey, 
            openLinks 
        } = req.body;

        if (!appName || !packageName || !websiteUrl) {
            return res.status(400).json({ error: 'نام اپلیکیشن، پکیج نیم و آدرس سایت الزامی است' });
        }

        const buildId = uuidv4();
        
        // آماده سازی داده برای گیت‌هاب
        const githubInputs = {
            app_name: appName,
            version: version || '1.0',
            package_name: packageName,
            website_url: websiteUrl,
            icon_url: iconUrl || '',
            splash_url: splashUrl || '',
            firebase_server_key: firebaseServerKey || '',
            open_links_externally: openLinks === 'inside' ? 'false' : 'true'
        };

        console.log('📦 ارسال به گیت‌هاب:', {
            buildId,
            ...githubInputs,
            firebase_server_key: firebaseServerKey ? '✅ دارد' : '❌ ندارد'
        });

        // ارسال به گیت‌هاب اکشن
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const REPO = process.env.GITHUB_REPO || 'navidkeyhanifard/webview-builder';

        if (!GITHUB_TOKEN) {
            return res.json({ 
                message: '⚠️ توکن گیت‌هاب تنظیم نشده. لطفا بعداً تنظیم شود.',
                buildId: buildId,
                inputs: githubInputs
            });
        }

        await axios.post(
            `https://api.github.com/repos/${REPO}/actions/workflows/build-apk.yml/dispatches`,
            {
                ref: 'main',
                inputs: githubInputs
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );

        res.json({ 
            message: '✅ ساخت اپلیکیشن شروع شد! تا چند دقیقه دیگر در بخش Actions گیت‌هاب قابل دانلود است.',
            buildId: buildId,
            actionsUrl: `https://github.com/${REPO}/actions`
        });

    } catch (error) {
        console.error('❌ خطا:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'خطا در ارتباط با گیت‌هاب',
            details: error.response?.data?.message || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 سرور روی پورت ${PORT} اجرا شد`);
});