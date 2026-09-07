# LLM Code Scoring Application

Ứng dụng web React dùng để chấm điểm code tự động với sự hỗ trợ của LLM (Large Language Models). Giao diện hiện đại, hỗ trợ nhiều tính năng như kéo thả, syntax highlighting, và visualization.

## 🛠️ Công nghệ sử dụng

- **React 18** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Recharts** - Charts & visualization
- **@dnd-kit** - Drag and drop functionality
- **React Syntax Highlighter** - Code highlighting
- **Supabase** - Backend service (optional)

## 📋 Yêu cầu hệ thống

- Node.js >= 18.x
- npm hoặc yarn

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Sau khi khởi động, mở trình duyệt và truy cập:
```
http://localhost:3000
```

### 3. Build production

```bash
npm run build
```

File build sẽ nằm trong thư mục `dist/`.

### 4. Kiểm tra TypeScript

```bash
npm run typecheck
```

## 📁 Cấu trúc dự án

```
/workspace
├── src/
│   ├── components/    # Các React components
│   ├── App.tsx        # Component chính
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── package.json       # Dependencies & scripts
├── tsconfig.json      # TypeScript config
├── vite.config.js     # Vite config
└── README.md          # Documentation
```

## 🎯 Các tính năng chính

- **Overview**: Giới thiệu và kiến trúc hệ thống
- **Modules**: Hiển thị các module của ứng dụng
- **Notebook**: Ghi chú và documentation
- **Demo**: Demo trực tiếp các tính năng

## 🔧 Configuration

### Vite Config (`vite.config.js`)
- Port: 3000
- HMR (Hot Module Replacement): Enabled
- Host: 0.0.0.0 (accessible from network)

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- JSX: react-jsx
- Target: ES2020

## 📝 Lưu ý

- Đảm bảo đã cài đặt Node.js trước khi chạy
- Nếu gặp lỗi về dependencies, xóa `node_modules` và `package-lock.json`, sau đó chạy lại `npm install`
- Ứng dụng sử dụng Tailwind CSS v4 với Vite plugin

## 🤝 Đóng góp

Mọi đóng góp vui lòng tạo pull request hoặc report issue.

## 📄 License

MIT License
