# About this project
__Context__:
Hi, I'm Marcus, a Mechatronic Engineering student. As I began applying for internships, I wanted a better way to present my personal projects to potential employers — something more flexible and professional than my previous setup.

Initially, I used Linktree to host links to dedicated Google Photos albums for each project. While this approach worked to some extent, it had several limitations. There was no clean way to add written context, organize links, or embed related content such as YouTube videos. Additionally, Google Photos had slow video playback and lacked meaningful integration options.

Despite its shortcomings, I appreciated a few things about that system:

- Linktree’s simple interface
- The recognizability of the Linktree domain, which likely gave visitors confidence to click through.
- The ease of creating and sharing photo albums.

In searching for an upgrade, I wanted a more robust yet low-maintenance solution. Ideally, each project would have its own web page with a description, image gallery, optional embedded video, and links back to other projects. I still wanted analytics, and I wanted to avoid the overhead of managing a backend or writing boilerplate code each time I added a new project.

Although I considered options like Notion and free website builders, they often came with limitations: paywalls, forced branding, or reduced control over layout and features. While I’m not experienced in web development, I found the idea of building a system I could control — and potentially extend in the future — appealing.

Eventually, I decided to create my own system. This repository is the result: a fully static portfolio site generated from a structured storage directory, where each project has its own folder containing a markdown file (for descriptions) and image files. To maintain the simplicity and recognizability of Linktree, I chose to continue using it as the primary landing page, directing visitors to dedicated project pages hosted on this custom-built site.

This repo is open to the public for anyone else in a similar situation and would like to use it for generating their own portfolio. [You can see my portfolio here.](https://linktr.ee/MarcusFrisch)

*P.S, if you like my work and know of any potential embedded/electronic internship opportunities, please reach out to me.*

__Technical details:__
A fully static portfolio website built with [Eleventy](https://www.11ty.dev/), dynamically powered by content from [Cloudinary](https://cloudinary.com/). Project descriptions and image galleries are automatically pulled from Cloudinary and rendered into clean, responsive project pages.

---

## 🚀 How It Works

- **Cloudinary** hosts all project data and images.
- Each project lives in a **folder** inside your Cloudinary Media Library (e.g. `projects/stm32_pedometer_pcb`).
- Each project folder contains:
  - A `.txt` file (Markdown-formatted description)
  - Any number of images
- A sync script (`sync-cloudinary.js`) fetches content from Cloudinary and generates:
  - `index.md` for Eleventy to build
  - `images.json` for gallery rendering
  - `.11tydata.js` to make image data available in templates
- Eleventy then builds static pages for each project.

---

## 🔧 Setup
The following guide will show you how to clone the repo onto your machine and build it and preview it locally. This will help familiarise you with the project and how it works. The latter half shares some important notes about using a third party to host your website.
I use Netlify as I can simply connect it to my GitHub account and have it auto build from the repo.

### 1. Clone the Repository

```bash
git clone https://github.com/marcus-frisch/LT_Portfolio_Generator.git
cd LT_Portfolio_Generator
```

### 2. Install Dependencies

⚠️ You will need to have NodeJS installed on your system to proceed. Please ensure you download and install NodeJS before running the command below.

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file: (you can use a text editor and save the file name as `.env` or use the below command)

```bash
cp .env.example .env
```

Fill it with your Cloudinary credentials and Linktree URL:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_PARENT_FOLDER=projects
LINKTREE_URL="https://linktr.ee/YOUR_USERNAME"
```

The guide will now show you how to setup Cloudinary to allow you to upload your projects. The guide for building the website will shortly commence.

---

## 📁 Uploading Projects to Cloudinary via the Media Library

### 🔑 Prerequisite
Make sure you're logged in to your [Cloudinary Dashboard](https://cloudinary.com/console).

---
### ⚠️ Step 0: setting up Cloudinary to upload files as expected.
This step does not take long, but it's kinda tedious to dig through the settings.
We need to make some slight adjustments to how Cloudinary handles uploaded files, that way the process for adding projects in the future is fairly intuitive, works with our script and a quick process.
It's likely Cloudinary could change their settings dashboard in the future, so I'll provide as much detail as I can so you can find the relevant settings if the process changes.

The screenshot below shows how to access the settings and what the values should be.
In the event the screenshot does not load, Here is the description.
- We need to edit the default upload preset. Bottom right there is a settings cog icon, click it. In the side tab that opens up, click `Upload` (underneath Product environment settings).
- Within the `Upload Presets` tab at the top of the screen, you should see one preset. Mine is called `ml_default`. Click the three dots on the far right, and click `edit`.
- Ensure
- - `Overwrite assets with the same public ID` is **ON**
- - Under `Generated public ID` select `Use the filename of the uploaded file as the public ID`
- - Turn ON `Prepend a path to the public ID` and select `Use the initial asset folder path`.

**Make sure you click `Save` - Note: you may need to click it twice**

![Upload settings screenshot](https://res.cloudinary.com/mportfoliocloud/image/upload/v1744288424/other/legacy_upload_settings.png "Upload settings")
![Legacy Upload settings screenshot](https://res.cloudinary.com/mportfoliocloud/image/upload/v1744288422/other/upload_settings.png "Legacy upload settings")


### ✅ Step 1: Open the Media Library

1. In the top navigation, click **Media Library**.
2. On the left sidebar, click the **Folders** tab.

---

### ✅ Step 2: Create the `projects` Folder (if it doesn't exist)

1. Click the ➕ (plus) icon next to “Folders”.
2. Name the new folder:

   ```
   projects
   ```

3. Click **Create**.

---

### ✅ Step 3: Upload the example project folder provided

1. Open the newly created `projects` folder.
2. Within this repo, you will see the folder `upload_this_project` this is an example project
3. Simply drag and drop the `upload_this_project` inside of the newly created `projects` folder within your Cloudinary account.
4. Pay attention to what you're uploading. You will see it's simply
   - a markdown textfile that contains a project description along with tags for formatting later
   - several images

---
## Setup complete! - Time to generate the actual website

### ☁️ Sync Projects from Cloudinary
Now that we have created our Cloudinary account and uploaded an example project, we now need to run a script that will automatically find your project folder(s) within your cloudinary account and download the index.txt and image urls which can then be used to generate our HTML files.

```bash
node sync-cloudinary.js
```

Your project will be auto-generated inside the `projects/` folder with a gallery and Markdown content ready to build.

### 5. Build and Serve Locally

```bash
npx @11ty/eleventy --serve
```

Visit: [http://localhost:8080/projects/example_project/](http://localhost:8080/projects/example_project/)

You should now see the example project visible:

![Example project webpage](https://res.cloudinary.com/mportfoliocloud/image/upload/v1744289208/other/example_project.png "Example project webpage")

And any attempt to visit a link that is not an existing project or webpage should redirect you to your linktree.

Congratulations, you're almost done.
- To make this website pubically accessible, you'll need to upload it to a static host. You can use a git repository to upload to a host (which makes it quite convinent when you need to make changes such as uploading a new project).
- I prefer to use [Netlify](https://www.netlify.com/) because it can be configured to automatically rebuild the website when new content is uploaded to Cloudinary (using webhooks) or you push a change to your repository
- If you prefer to use another host such as 'GitHub pages' you (may) need to remove `_site` from `.gitignore` and figure out any additional setup required such as GitHub Actions.

- ⚠️ **Attention!** Whenever you upload a new project to your cloudinary account you'll need to:
- - Sync your local repo with cloudinary `node sync-cloudinary.js`
- - To build and view the site locally run `npx @11ty/eleventy --serve`
- - commit the new changes to your static host
- - remember to add the new project webpage link to your linktree.

### ✅ Basic site setup is done Congratulations!
Keep reading below though...

## 🌐 Deployment

You can deploy this site as a static project to:

- **GitHub Pages**
- **Netlify**
- Other static hosts

The `404.html` page gracefully redirects unknown URLs to your Linktree profile.

### ⚠️ Remember
When you use a third party to host your website, you'll need to define the 'environment variables' or remove the `.env` from the `.gitignore` file. (I highly do not recommend you do this.) Instead, look up how to configure environment variables on your host. This can be done easily within Netlify's control panel. Without updating the variables, the website will be completely useless and not able to build.

Screenshot of configuring environment variables in Netlify control panel:
![Build command in Netlify](https://res.cloudinary.com/mportfoliocloud/image/upload/v1753776674/other/net_env.png)

---

### 🤖 Automated building

🏆 Personally, I use [Netlify](https://www.netlify.com/) because I can set up the project to be __completely automated for free__. This means, whenever I upload new content to Cloudinary (such as a new project or new photos to exising projects) the website will automatically re-build itself within a couple of minutes and I do not need to do anything.
For now, I won't include a detailed step-by-step but rather the 'things you need to look into' to set this up yourself. It is not complicated and googling will find the resources and how to guides you need.
If you're interested in doing this you'll need to look into:

- Set a build command (Netlify: Project configuration -> Build settings -> Build command). This will be the build script we used earlier to build/preview the website on your machine. This allows Netlify to actually build your website.
- Create a build hook (Netlify: Project configuration -> Build settings -> Build hook). This is a HTTP link that when visited will trigger Netlify to run your build script. This is what we call a 'webhook', and we can configure Cloudinary to call this webhook whenever you make changes to your assets on your account. (This is called a 'callback')
- Implementing the webhook as a 'callback' on Cloudinary.

Below I have some pictures simply showing you what this looks like implemented in the Admin dashboard panels of Netlify and Cloudinary as I write this.

Configuring the build command in Netlify:
![Build command in Netlify](https://res.cloudinary.com/mportfoliocloud/image/upload/v1753775611/other/net_build_sett.png)

Configuring the webhook in Netlify:
![Webhook in Netlify](https://res.cloudinary.com/mportfoliocloud/image/upload/v1753775623/other/net_webhook.png)

Configuring the webhook in Cloudinary. Take note: I configured it to call the webhook whenever an asset (file/image) is uploaded, deleted or renamed.
![Webhook in Cloudinary](https://res.cloudinary.com/mportfoliocloud/image/upload/v1753775637/other/cloud_webhook.png)

---

## 🧠 Notes

- You can add new projects simply by uploading a new folder containing a `index.txt` description and images to a new folder in Cloudinary. No need to write code.
- All styling is embedded for simplicity — no external CSS framework used.
- If you want to make changes to the template, the `.njk` files are the template files to edit. (Contains the HTML and CSS)




