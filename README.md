# Selecting the Right Database

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Website](https://img.shields.io/badge/Website-Live-brightgreen)](https://dmccreary.github.io/right-database/)

This repository contains educational resources for teaching the Architecture Tradeoff Analysis Methodology (ATAM) adapted for NoSQL database selection. Originally developed by Carnegie Mellon University for large computer architecture projects, ATAM has been adapted here to help organizations select the most appropriate database architecture for their business challenges.

## 🌐 Live Website

Visit the live documentation site: [https://dmccreary.github.io/right-database/](https://dmccreary.github.io/right-database/)

## 📚 About

This site supports the textbook **"Making Sense of NoSQL"** by Dan McCreary and Ann Kelly, published by Manning Publications. The resources help students and professionals understand:

- The ATAM methodology for database selection
- Trade-offs between different NoSQL database types
- Real-world case studies and implementation strategies
- Quality attributes and utility trees for database architectures

## 🗂️ Repository Structure

```
.
├── README.md
├── docs/                          # Documentation source files
│   ├── index.md                  # Homepage
│   ├── about.md                  # Project background
│   ├── atam-process.md           # Core ATAM methodology
│   ├── atam-db-process.md        # ATAM for database selection
│   ├── concepts/                 # Foundational concepts
│   │   ├── utility-tree.md
│   │   └── acid-vs-base.md
│   ├── db-types/                 # Database type explanations
│   │   ├── 01-relational.md
│   │   ├── 02-analytical.md
│   │   ├── 03-key-value.md
│   │   ├── 04-column-family.md
│   │   ├── 05-graph.md
│   │   └── 06-document.md
│   ├── case-studies/             # Real-world examples
│   │   ├── star-process.md
│   │   └── amazon-shopping-cart.md
│   ├── img/                      # Images and diagrams
│   └── slides.md                 # Presentation materials
├── slides/                       # PowerPoint presentations
├── mkdocs.yml                    # MkDocs configuration
└── mkdocs-gen.sh                 # Build script
```

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- MkDocs with Material theme

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/dmccreary/right-database.git
   cd right-database
   ```

2. Install dependencies:
   ```bash
   pip install mkdocs mkdocs-material
   ```

3. Serve locally:
   ```bash
   mkdocs serve
   ```

4. Open your browser to `http://localhost:8000`

### Building for Production

```bash
mkdocs build
```

## 📖 Key Topics Covered

- **ATAM Methodology**: Step-by-step process for architecture evaluation
- **Database Types**: Comprehensive coverage of 6 major NoSQL database categories
- **Quality Attributes**: Performance, scalability, consistency, and availability trade-offs
- **Case Studies**: Real-world examples including Amazon's shopping cart architecture
- **Utility Trees**: Structured approach to quality attribute analysis

## 🎯 Database Types Covered

1. **Relational** - Traditional RDBMS systems
2. **Analytical** - Data warehousing and OLAP systems
3. **Key-Value** - Simple key-value stores
4. **Column Family** - Wide-column databases
5. **Graph** - Graph databases for connected data
6. **Document** - Document-oriented databases

## 📊 Learning Resources

- Interactive case studies with real-world scenarios
- Visual diagrams and process flows
- Presentation slides for classroom use
- Hands-on exercises and examples

## 🤝 Contributing

This is an educational resource. If you find errors or have suggestions for improvements, please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## 👨‍💼 Author

**Dan McCreary**
- LinkedIn: [danmccreary](https://www.linkedin.com/in/danmccreary/)
- Book: [Making Sense of NoSQL](https://www.manning.com/books/making-sense-of-nosql)

## 🔗 Related Resources

- [Manning Publications - Making Sense of NoSQL](https://www.manning.com/books/making-sense-of-nosql)
- [Carnegie Mellon ATAM](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=5177)
- [NoSQL Database Information](https://nosql-database.org/)

---

*This repository supports educational initiatives in database architecture and selection methodologies.*