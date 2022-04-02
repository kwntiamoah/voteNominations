import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  entity_div_code: String = ""

  nomineeForm: FormGroup = new FormGroup({})
  isLoading: boolean = false;
  categories: any[] = []
  event: any

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.nomineeForm = this.fb.group({
      category: [null, [Validators.required]],
      name_of_nominee: [null, [Validators.required]],
      nominee_phone: [null, [Validators.required]],
      nickname: [null, [Validators.required]],
      organization: [null, [Validators.required]],
      name_of_nominator: [null, [Validators.required]],
      nominator_phone: [null, [Validators.required]],
      country: [null, [Validators.required]],
      region: [null, [Validators.required]],
      whatsapp: [null, [Validators.required]],
      reason: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      location: [null, [Validators.required]],
      link_of_proof: [null, [Validators.required]],
      age: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      document_or_image: [null, []],
      picture: [null, []]
    })
  }

  // getter fxns
  get category() { return this.nomineeForm.get('category') }
  get name_of_nominee() { return this.nomineeForm.get('name_of_nominee') }
  get nominee_phone() { return this.nomineeForm.get('nominee_phone') }
  get nickname() { return this.nomineeForm.get('nickname') }
  get organization() { return this.nomineeForm.get('organization') }
  get name_of_nominator() { return this.nomineeForm.get('name_of_nominator') }
  get nominator_phone() { return this.nomineeForm.get('nominator_phone') }
  get country() { return this.nomineeForm.get('country') }
  get region() { return this.nomineeForm.get('region') }
  get whatsapp() { return this.nomineeForm.get('whatsapp') }
  get reason() { return this.nomineeForm.get('reason') }
  get email() { return this.nomineeForm.get('email') }
  get location() { return this.nomineeForm.get('location') }
  get link_of_proof() { return this.nomineeForm.get('link_of_proof') }
  get age() { return this.nomineeForm.get('age') }
  get dob() { return this.nomineeForm.get('dob') }
  get document_or_image() { return this.nomineeForm.get('document_or_image') }
  get picture() { return this.nomineeForm.get('picture') }

  ngOnInit(): void {
    this.getEventDetails()
    this.getCategories()
  }

  getEventDetails(): void {
    this.http.get(`https://vote-api.amazingsystems.org/get_event_details?entity_div_code=MDAwMDE2`)
      .subscribe({
        next: (res: any) => res['resp_code'] === '000' ? this.event = res['details'] : Swal.fire({ icon: 'error', text: 'Error getting Event details', confirmButtonColor: '#2563EB' }),
        error: err => Swal.fire({ icon: 'error', text: 'Error getting Event details', confirmButtonColor: '#2563EB' })
      })
  }

  getCategories(): void {
    this.http.get(`https://vote-api.amazingsystems.org/get_categories?entity_div_code=MDAwMDE2`)
      .subscribe({
        next: (res: any) => res['resp_code'] === '000' ? this.categories = res['details'] : Swal.fire({ icon: 'error', text: 'Error getting Categories', confirmButtonColor: '#2563EB' }),
        error: err =>  Swal.fire({ icon: 'error', text: 'Error getting Categories', confirmButtonColor: '#2563EB' }),
      })
  }

  submit(): void {
    this.isLoading = true
    // if (this.nomineeForm.invalid) {
    //   Swal.fire({ icon: 'error', text: 'Please fill all fields', confirmButtonColor: '#2563EB' })
    //   return
    // }

    const payload = {
      src: "WEB",
      activity_type_code: "NOM",
      plan_id: this.entity_div_code,
      cat_id: this.category?.value,
      delegate_name: this.name_of_nominator?.value,
      delegate_mobile_number: '233' + this.nominee_phone?.value['number'].substring(1),
      delegate_email: this.email?.value,
      delegate_proof_url: this.link_of_proof?.value,
      delegate_age: this.age?.value,
      delegate_height: "",
      delegate_weight: "",
      delegate_file_reason: this.reason?.value,
      delegate_location: this.location?.value,
      delegate_region: this.region?.value,
      delegate_residential_addr: "",
      delegate_whatsapp_number: this.whatsapp?.value
    }

    this.http.post('https://vote-api.amazingsystems.org/req_nomination', payload)
      .subscribe({
        next: (res: any) => res['resp_code'] == '148' ? Swal.fire({ icon: 'success', text: res['resp_desc'], confirmButtonColor: '#2563EB' }) : Swal.fire({ icon: 'error', text: res['resp_desc'], confirmButtonColor: '#2563EB' }),
        error: (err: any) => console.log(err),
        complete: () => {
          this.isLoading = false
          this.nomineeForm.reset()
        }
      })
  }
}
