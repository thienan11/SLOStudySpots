import { css, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StudySpot } from 'server/models';
import { Msg } from '../messages';
import { Model } from '../model';
import { View, Auth, Observer, define } from '@calpoly/mustang';
import resetCSS from '../css/reset';
import { ImageViewerElement } from '../components/image-viewer';

export class GalleryViewElement extends View<Model, Msg> {

  static uses = define({
    "image-viewer": ImageViewerElement
  });
  
  @property({ attribute: "spot-id", reflect: true })
  spotid = "";

  @state()
  get studySpot(): StudySpot | undefined {
    return this.model.studySpot;
  }

  @property({ type: Object }) selectedPhoto: { url: string; uploadedBy: string; uploadDate: Date } | null = null;

  constructor() {
    super("slostudyspots:model");
  }

  private selectedFile: File | null = null;

  @state()
  username = "anonymous";

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        this.username = user.username;
      } else {
        this.username = "anonymous";
      }
    });
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "spot-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      console.log("Study Spot Page:", newValue);

      this.dispatchMessage([
        "study-spot/select",
        { spotid: newValue }
      ]);
    }
  }

  private _viewImage(photo: { url: string; uploadedBy: string; uploadDate: Date }) {
    console.log("Photo clicked:", photo);
    this.selectedPhoto = photo;
  }

  private _closeViewer() {
    this.selectedPhoto = null;
  }

  render(): TemplateResult {
    const {
      photos
    } = this.studySpot || {};

    console.log("PHOTOS", photos);

    console.log("USERNAME", this.username);

    return html`
      <main>
        <section class="photo-upload">
          <a href="/app/study-spot/${this.spotid}">← Back to ${this.studySpot?.name}</a>
          <h2>Upload Your Photos</h2>
          ${this.username === "anonymous" ? html`
            <p>Please sign in to upload photos.</p>
          ` : html`
            <form @submit=${this._handleFileUpload}>
              <input
                  type="file"
                  @change=${this._handleFileSelected} />
              <button type="submit" class="btn-add-photo">
                <img src="/icons/upload-photo.svg" alt="Add Photo Icon" class="btn-icon-white">
                Upload Photo
              </button>
            </form>
          `}
        </section>

        <section class="gallery">
          <h2>Photos for ${this.studySpot?.name}</h2>
          ${photos && photos.length > 0 ? photos.map(
            (photo: { url: string; uploadedBy: string; uploadDate: Date }) => html`
              <div class="photo" @click=${() => this._viewImage(photo)}>
                <img src="${photo.url}">
                <!-- <div class="photo-details">
                  <p>Uploaded by: ${photo.uploadedBy}</p>
                  <p>Upload date: ${new Date(photo.uploadDate).toLocaleDateString()}</p>
                </div> -->
              </div>
            `
          ) : html`
            <p>No photos available.</p>
          `}
        </section>

        ${this.selectedPhoto ? html`
          <image-viewer
            url="${this.selectedPhoto.url}"
            uploadedBy="${this.selectedPhoto.uploadedBy}"
            uploadDate="${this.selectedPhoto.uploadDate}"
            ?open="${!!this.selectedPhoto}"
            @close-popup=${this._closeViewer}
          ></image-viewer>
        ` : ''}
      </main>
    `;
  }

  _handleFileSelected(ev: Event) {
    const target = ev.target as HTMLInputElement;
    this.selectedFile = (target.files as FileList)[0];
  }

  _handleFileUpload(ev: Event) {
    ev.preventDefault();
    if (this.username === "anonymous") {
      alert("Please sign in to upload photos.");
      return;
    }
    if (!this.selectedFile || !this.spotid) return;
  
    this._readFileAsArrayBuffer(this.selectedFile).then(buffer => {
      const { name, size, type } = this.selectedFile!;
      const query = new URLSearchParams({
        filename: name, 
        studySpotId: this.spotid,
        username: this.username
      });
      const url = new URL("/photos", document.location.origin);
      url.search = query.toString();
  
      console.log("Uploading file:", this.selectedFile);
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": type,
          "Content-Length": size.toString()
        },
        body: buffer
      })
        .then(response => {
          if (response.status === 201) {
            return response.json();
          } else {
            throw new Error(`Upload failed with status: ${response.status}`);
          }
        })
        .then(json => {
          console.log("Image has been uploaded to", json.url);
          alert("Photo uploaded successfully!"); // Success alert

          // clear the selected file
          this.selectedFile = null;

          // refresh the study spot data to show the new photo
          this.dispatchMessage(["study-spot/select", { spotid: this.spotid }]);
        })
        .catch(error => {
          console.log("Upload failed", error);
          alert("Upload failed. Please try again."); // Error alert
        });
    }).catch(error => {
      console.log("File reading failed", error);
      alert("File reading failed. Please try again.");
    });
  }
  

  _readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  static styles = [
    resetCSS,
    css`
      .photo-upload {
        background-color: var(--color-background-primary);
        padding: 20px;
        border-radius: var(--border-radius);
        text-align: center;
        margin: var(--space-regular);
        /* box-shadow: var(--shadow-hover-small); */
      }

      .photo-upload h2 {
        color: var(--color-secondary);
        padding-top: var(--space-regular);
      }

      .photo-upload form {
        margin-top: 20px;
      }

      .photo-upload input[type="file"] {
        margin-bottom: 10px;
      }

      .btn-add-photo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-primary);
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: var(--border-radius);
        margin: 0 10px;
        border: none;
      }
      
      .btn-add-photo:hover, .btn-write-review:hover, .feature-tag:hover {
        background-color: var(--color-links);
        cursor: pointer; /* prob not needed for tags once it can be clicked */
      }

      .btn-icon-white {
        height: 20px;
        width: auto;
        margin-right: 8px;
        filter: brightness(0) invert(1);
      }

      .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: var(--space-regular);
      }

      .gallery h2 {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--color-secondary);
      }

      .gallery p {
        grid-column: 1 / -1;
        text-align: center;
      }

      .photo {
        height: 200px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background-color: #eee;
        border-radius: var(--border-radius);
      }

      .photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-upload {
        margin: var(--space-regular) 0;
      }

      .photo-upload a {
        color: var(--color-links);
        text-decoration: none;
      }

      .photo-upload a:hover {
        text-decoration: underline;
      }

      .photo-upload form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .photo-upload button {
        margin-top: var(--space-small);
      }
    `
  ];

  _authObserver = new Observer<Auth.Model>(
    this,
    "slostudyspots:auth"
  );
}