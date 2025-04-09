# 🎓 Smart Student ID Generator

A ReactJS-based Student ID Card Generator inspired by Unity’s student management module. This project showcases a polished UI/UX, QR code generation, template switching, and image export features — perfect for modern school systems.

## 🚀 Live Demo

👉 [Click here](https://id-card-ten-lac.vercel.app) 

---

## 📌 Features

### 📝 Student Data Form
Capture student details with a sleek form:
- Name
- Roll Number
- Class & Division (dropdown)
- Allergies (multi-select)
- Photo Upload (with preview)
- Rack Number
- Bus Route Number (dropdown)
- Submit Button

### 🆔 Smart ID Card Preview
After submitting, generate a clean and professional ID card:
- Displays student details
- Shows photo and allergies (if any)
- Rack & Bus Route details
- QR Code (encodes full student data in JSON format)
- "Download as PNG" button

### 🎨 Template Switching
Switch between 2 unique ID card designs using a dropdown or toggle.

### 📂 Persistent Data *(Bonus)*
- Save generated cards to `localStorage`
- View and re-download older entries

---

## 🛠️ Tech Stack

- **ReactJS 18+**
- **TailwindCSS** (for styling)
- **qrcode.react** – for generating QR codes
- **html-to-image** – to download the ID as PNG



---

## 🧠 How It Works

1. User fills out the student form.
2. Form data is validated and stored in state.
3. A preview card renders using the submitted data.
4. QR Code is generated with embedded student data.
5. PNG download is enabled via `html-to-image`.
6. Switch templates using a dropdown.
7. Data is saved in `localStorage` for future use *(optional)*.

---

## 📅 Installation & Running Locally

```bash
git clone https://github.com/pavannitheesh/ID-card.git
cd ID-card
npm install
npm start
```
---
