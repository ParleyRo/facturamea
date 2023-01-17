export default {
	template: `
		<div class="container is-fullhd">
			<form 
				method="post"
				action="/settings/add/company"
				@submit="checkForm"
			>
				<div class="columns is-multiline is-mobile">

					<div v-for="(data, fieldName, index) in fields" class="column is-half">

						<div><p class="title is-6">{{formatCamelCase(fieldName)}}</p></div>

						<div class="field">
							<div class="control is-small">
								<input 
									class="input is-small" 
									v-model="data.value" 									
									type="text" 
									:placeholder="formatCamelCase(fieldName)"
									:required="data.isRequired ? true : false"
								>
							</div>
						</div>

					</div>
				
				</div>
				
				<div class="columns">
					<div class="column">
						<div class="control">
							<button class="button is-primary">Submit</button>
						</div>
					</div>
				</div>
				
			</form>
		</div>
	`,
	props: {
		
	},
	data() {

		const aFieldsName = [
			'companyName','companyRegistrationNumber','VATNumber',
			'Address','Phone','Email','Bank','Swift','Iban'
		];

		let oFields = {};

		aFieldsName.forEach(fieldName => oFields[fieldName] = {
			value: ''
		});

		oFields.companyName['isRequired'] = true;

		return {
			errors: {},
			fields: oFields
		}
	},
	async created(){
	
	},
	components: {
	
	},
	methods: {
		
		formatCamelCase: function(sText){
			
			const sFormatText = sText.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
			
			return sFormatText.charAt(0).toUpperCase() + sFormatText.slice(1);

		},
		checkForm: async function (e) {

			e.preventDefault();
		
			this.errors = {};

			const oData = {};

			for (const fieldName in this.fields) {
				oData[fieldName] = this.fields[fieldName].value

				if (this.fields[fieldName].isRequired && !this.fields[fieldName].value) {
					this.errors[fieldName] = `${fieldName} required.`;
				}
			}
			
			if (Object.keys(this.errors).length) {
				console.log(this.errors)
				return false;
			}

			const response = await fetch(e.target.action,{
				method: 'post',
				body: JSON.stringify(oData),
				headers: {'Content-Type': 'application/json'}
			});

			if(response.redirected && response.url){
				window.location.href = response.url;
			}
			
			const data = await response.json();

			if(data.error){
				this.errors['default'] = data.message;
			}
			
			
		}
	}

}