import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./footer/footer";
import { HeroBanner } from "./hero-banner/hero-banner";
import { FeatureSection } from './feature-section/feature-section';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, HeroBanner,FeatureSection],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ITI-Front');
}
