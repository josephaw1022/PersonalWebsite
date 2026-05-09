## Description

This PR rewrites the Personal Website into a modern, multi-page application using Next.js App Router. It migrates away from the monolithic static HTML served directly by NGINX towards a robust React-based architecture that enables better component reusability, modern styling, and an improved multi-page routing structure.

---

## Type of Change

- [ ] Bug fix
- [x] New feature / enhancement
- [x] Infrastructure change
- [x] Refactor / cleanup
- [ ] Documentation update
- [x] CI/CD pipeline change
- [ ] Dependency update

---

## Changes Made

- Transitioned the single-page HTML application into a Next.js App Router project with dedicated routes for Home, About, and Skills.
- Implemented premium styling using Tailwind CSS, including glassmorphism effects, dynamic gradients, micro-animations, and modern web typography (Inter and Outfit).
- Componentized the UI into reusable React components (e.g., Header, Footer) and integrated Datadog RUM via a dedicated client component.
- Updated the `Containerfile` to utilize a Next.js standalone multi-stage Node.js build, optimizing the final production image size.
- Adjusted local development operations in `Taskfile.yaml` to include Next.js development server and automated Jest testing.
- Overhauled OpenShift infrastructure manifests (`infra/okd-setup.sh`) and Docker Compose configuration to support the Node.js runtime on port 3000.
- Integrated a comprehensive automated test suite utilizing Jest and React Testing Library, alongside a new GitHub Actions test workflow.

---

## Testing

- [ ] Terraform `validate` and `fmt` passed (if applicable)
- [x] Tested in **dev** environment
- [ ] Tested in **prod** environment (if applicable)
- [x] Relevant workflows passed in CI

---

## Checklist

- [x] My changes follow the coding conventions and style of this project
- [x] I have updated relevant documentation
- [x] I have not committed any secrets or sensitive values
- [x] I have reviewed my own diff before requesting review

---

## Screenshots / Logs

