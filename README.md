# Personal Portfolio

This is my personal portfolio website. I built it to display my projects and have a central place for my work.

### Built With

- **Framework:** React 19 & TypeScript
- **Bundler:** Vite
- **Routing:** React Router 8
- **Styling:** Tailwind CSS 4
- **UI Components:** ShadCN

## About the Background

The animated background is drawn with the **Canvas API**, without an external animation library. It lays out a responsive grid of points and uses sine waves to make the grid ripple and warp. The rendering blends connecting lines with dots, shifting between the two as the animation runs.

Pointer movement pushes nearby points away from the cursor, and pointer presses send out expanding ripples. The grid also shifts slightly with page scrolling. The animation uses `requestAnimationFrame` and respects the `prefers-reduced-motion` setting.

## 📄 License

[MIT](https://github.com/xristosn/portfolio/blob/main/LICENSE)

Note: All personal branding, images, and written content are my personal property. You are welcome to use the code logic (like the Canvas background) but please do not use my personal photos, logo, or identity for your own projects.