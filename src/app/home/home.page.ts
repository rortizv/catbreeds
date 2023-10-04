import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, IonInfiniteScroll, ToastController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Cat } from 'src/app/models/cat';
import { CatsService } from 'src/app/services/cats.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('popover') popover: any;

  public catBreeds: Cat[] = [];
  private itemsToShow = 5;
  private allCatBreeds: Cat[] = [];
  private startIndex = 0;
  public isOpen = false;

  constructor(private catsService: CatsService, private loadingCtrl: LoadingController, private toastController: ToastController) { }

  ngOnInit() {
    this.getCatBreeds();
  }

  async getCatBreeds() {
    let imgUrl = 'https://ionicframework.com/docs/img/demos/card-media.png';

    const loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });

    await loading.present();

    this.catsService.getCatBreeds().pipe(
      switchMap((cats) => {
        const requests = cats.map((cat) => {
          return this.catsService.getCatImage(cat.reference_image_id).pipe(
            map((imageData: any) => {
              console.log(imageData);
              const catBreed: Cat = {
                breedName: cat.name,
                origin: cat.origin,
                affectionLevel: cat.affection_level,
                intelligence: cat.intelligence,
                imageUrl: imageData['url'] || imgUrl,
                wikipediaUrl: cat.wikipedia_url,
                description: cat.description,
                temperament: cat.temperament,
                adaptability: cat.adaptability,
                isFavorite: false,
              };
              return catBreed;
            })
          );
        });
        return forkJoin(requests);
      })
    ).subscribe((catBreeds) => {
      this.catBreeds = catBreeds;
      loading.dismiss();
    });
  }

  loadMoreData(event: any) {
    this.startIndex += this.itemsToShow;
    const additionalCatBreeds = this.allCatBreeds.slice(
      this.startIndex,
      this.startIndex + this.itemsToShow
    );

    this.catBreeds.push(...additionalCatBreeds);
    event.target.complete();

    if (this.catBreeds.length >= this.allCatBreeds.length) {
      event.target.disabled = true;
    }
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  async markAsFavorite(breed: Cat) {
    breed.isFavorite = true;

    const toast = await this.toastController.create({
      message: 'You have marked this cat breed as favorite',
      duration: 2000,
      color: 'success', // Fondo verde
    });

    await toast.present();
  }

  async unmarkAsFavorite(breed: Cat) {
    breed.isFavorite = false;

    const toast = await this.toastController.create({
      message: 'The cat breed is no longer favorite',
      duration: 2000,
      color: 'warning', // Fondo amarillo
    });

    await toast.present();
  }


}
