export default {
	template: `
<div class="invoiceData">

	<div class="columns is-justify-content-center is-align-items-end is-multiline">
		
		<div class="column is-2">
			<div class="field">
				<label class="mb-2">Invoice number</label>
				<div class="control pt-1">
					<input 
						class="input" 
						v-model="invoice.number" 
						type="text" 
						placeholder="Invoice number..."
						:required="true"
					>
				</div>
			</div>
		</div>

		<div class="column is-2 is-relative">
			<label class="mb-2">Currency </label>
			<span 
				:class="[currencyValue == '' ? 'is-loading' : '']"
				class="tag is-info is-light"
				style="position: absolute;bottom: -10px;right: 0.75rem;" 
				v-if="invoice.currency != 'ron'"
			>
				<b v-if="currencyValue != ''">{{currencyValue}} ron</b>
			</span>
			<div class="control">
				<div class="select is-fullwidth">
					<select v-model="invoice.currency">
						
						<option 
							v-for="(currency,currencyName, index) in currenciesList"
							:value="currencyName"
						>
							{{currency.label}}
						</option>

					</select>
				</div>
			</div>
		</div>

		<div class="column is-3">
			<label class="mb-2">Invoice date</label>
			<button id="invoiceDate" ref="invoiceDateTrigger" type="button">Change</button>
		</div>

		<div class="column is-3">
			<label class="mb-2">Invoice due date</label>
			<button id="invoiceDueDate" ref="invoiceDueDateTrigger" type="button">Change</button>
		</div>

	</div>

	<div v-for="(product, index) in invoice.products" class="columns is-justify-content-center is-align-items-end is-multiline">
		
		<div class="column is-4">
			<div class="field">
				<label class="mb-2">Description</label>
				<div class="control pt-1">
					<input 
						class="input" 
						type="text" 
						placeholder="Description..."
						:required="true"
						v-model="product.name"
					>
				</div>
			</div>
		</div>

		<div class="column is-1">
			<div class="field">
				<label class="mb-2">Unit</label>
				<div class="control pt-1">
					<input 
						class="input" 
						type="text" 
						placeholder="Unit..."
						:required="true"
						v-model="product.unit"
					>
				</div>
			</div>
		</div>

		<div class="column is-2">
			<div class="field">
				<label class="mb-2">Quantity</label>
				<div class="control pt-1">
					<input 
						class="input" 
						type="text" 
						placeholder="Qty..."
						:required="true"
						v-model="product.qty"
					>
				</div>
			</div>
		</div>

		<div class="column is-2">
			<div class="field">
				<label class="mb-2">Amount</label>
				<div class="control pt-1">
					<input 
						class="input" 
						type="text" 
						placeholder="Amount..."
						:required="true"
						v-model="product.amount"
					>
				</div>
			</div>
		</div>

		<div class="column is-1 has-text-right">
			<button v-if="index===0" v-on:click="addProduct" class="button is-info">
				<span class="icon">
					<i class="fas fa-plus"></i>
				</span>
			</button>
		
			<button v-else v-on:click="removeProduct(index)" class="button is-danger">
				<span class="icon">
					<i class="fas fa-minus"></i>
				</span>
			</button>
		</div>

	</div>

</div>
	`,
	data() {

		return {
			invoice: this.invoiceData
		}
		
	},
	props: {
		invoiceData: Object,
		currenciesList: Object,
		currencyValue: String
	},
	methods:{
		addProduct: function(){
			this.invoice.products.push({
				name: '',
				qty: 1,
				unit: 'buc',
				amount: 0
			})
		},
		
		removeProduct: function(index){
			this.invoice.products.splice(index,1);
		},

		loadBulmaCalendar: function(reloads = 0){

			const self=this;

			if (typeof bulmaCalendar === 'undefined') {
				if(reloads > 20){
					return false;
				}

				setTimeout(() => {
					return this.loadBulmaCalendar(reloads+1)
				}, 100);
				
				return false
			}

			const invoiceCalendar = bulmaCalendar.attach(this.$refs.invoiceDateTrigger, {
				startDate: this.invoice.date,
				dateFormat: "dd-MM-yyyy",
				type: 'date',
				closeOnSelect: true
			})[0];
			
			const invoiceDueCalendar = bulmaCalendar.attach(this.$refs.invoiceDueDateTrigger, {
				startDate: this.invoice.dueDate,
				dateFormat: "dd-MM-yyyy",
				type: 'date',
				minDate: this.invoice.date
			})[0];
			
			invoiceCalendar.on('select', function(e){

				self.invoice.date = e.data.date.start || null
				self.invoice.dueDate = new Date(self.invoice.date.getTime() + self.invoice.dueDateTime)
				
				invoiceDueCalendar.date.start = self.invoice.dueDate;
				invoiceDueCalendar.save();

			})

			invoiceDueCalendar.on('select', function(e){
				self.invoice.dueDate = e.data.date.start || null;
			})
			
			return true

		}
		
	},
	mounted() {

		this.loadBulmaCalendar();
		
	}
}