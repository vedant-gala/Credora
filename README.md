# Credora
Optimize your spends to reap maximum credit card rewards!
A comprehensive credit card management and optimization platform that helps users maximize rewards, track transactions, and make informed financial decisions.

## 🏗️ Project Structure
```
credit_card_optimizer/
├── backend/               # Node.js + Express.js backend
├── web-dashboard/         # React frontend
├── mobile-app/            # React Native mobile app
├── ml-services/           # Python ML services
├── tools/                 # Development tools
├── shared/                # Shared types and utilities
├── docs/                  # Project documentation
```

## 🛠️ Proposed Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with comprehensive middleware stack
- **Authentication**: JWT with Redis token storage
- **Database**: PostGreSQL (planned)
- **Caching**: Redis for session management
- **SMS Parsing**: Hybrid approach (Phi-2 LLM + Regex patterns)
- **LLM Integration**: Ollama with Phi-2:2.7b model
- **Logging**: Comprehensive packet traversal logging

### Frontend
- **Web Dashboard**: React with TypeScript
- **Mobile App**: React Native
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI / Native Base

### ML Services
- **Language**: Python
- **Framework**: FastAPI
- **ML Libraries**: scikit-learn, pandas, numpy
- **Model Serving**: Docker containersw

### Development Tools
- **SMS Simulator**: TypeScript-based testing tool
- **API Testing**: Comprehensive test suites
- **Documentation**: Swagger/OpenAPI specs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for ML services)
- Docker and Docker Compose

### 1. Clone and Setup
   ```bash
   git clone <repository-url>
   cd Credora
   
   ```

### 2. Setup ENV
   ```bash
# Windows
.\setup-env.ps1
   
# Linux/macOS
./setup-env.sh
   ```
   
### 3. Start Services
 TODO @vedant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.