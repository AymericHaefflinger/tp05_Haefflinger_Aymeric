import { Component, Input } from "@angular/core";
import { from, of, interval } from "rxjs";
import { filter } from "rxjs/operators";
import { HttpServiceService } from "../../../http-service.service";
import { Article } from "../article/article";
import { Store, Select } from "@ngxs/store";
import { AddArticle } from "../article/article.action";
import { ArticleState } from "../article/article.state";
import { Observable } from "rxjs";

@Component({
  selector: "produit",
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent {
  @Input() name: string;

  Articles: Article[];
  allArticles: Article[];

  constructor(
    public HttpServiceService: HttpServiceService,
    private store: Store
  ) {}

  getData(): void {
    this.HttpServiceService.getData().subscribe(
      Articles => (this.Articles = Articles)
    );
  }

  getDataInit(): void {
    this.HttpServiceService.getData().subscribe(
      Articles => (this.allArticles = Articles)
    );
    this.HttpServiceService.getData().subscribe(
      Articles => (this.Articles = Articles)
    );
  }

  searchArticle(searchTerm: string) {
    if (searchTerm) {
      let allArticles = from(this.allArticles);
      this.Articles = [];
      let searchResult = allArticles
        .pipe(filter(a => a.nom.includes(searchTerm)))
        .subscribe(Articles => this.Articles.push(Articles));
    } else {
      this.getData();
    }
  }

  ngOnInit() {
    this.getDataInit();
  }

  addArticle(a: Article) {
    this.store.dispatch(new AddArticle(a)).subscribe();
  }
}
