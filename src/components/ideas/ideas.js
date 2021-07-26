let jsx = <Fragment>

	<Breadcrumbs>
		<Template $separator>/</Template>
		<Link $breadcrumb>Home</Link>
		<Button $breadcrumb link>Articles</Button>
		<span $breadcrumb>Politics</span>
	</Breadcrumbs>

	<StepNavigation>
		<Step title="Sign Up">
			<TextField label="Username"/>
			<PasswordField label="Password"/>
			<Button $next-button>Next</Button>
		</Step>
		<Step>
			<span $title><IconContact/> Contact Info</span>
			<TextField label="Phone"/>
			<TextField label="Address"/>
			<Button $next-button>Next</Button>
		</Step>
		<Step>
			<div>
				You finished all steps.
				Create your account now.
			</div>
			<Button $complete-button>Create</Button>
		</Step>
	</StepNavigation>

	<dl>
		<dt>Name</dt>
		<dd>{product.name}</dd>
		<dt>Price</dt>
		<dd>{product.price.currency} {product.price.value}</dd>
		<dt>Avaibility</dt>
		<dd>{product.avaibility} available</dd>
	</dl>

	<Descriptor entity={product}>
		<Description className="name" accessor="name" label="Name"/>
		<Description className="price" accessor="product" label="Price">{p => `${p.currency} ${p.value}` }</Description>
		<Description className="avaibility" accessor="avaibility" label="Avaibility">{a => a + " available"}</Description>
	</Descriptor>

</Fragment>

{/*
	<Form (grid cols="4fr minmax(256px, 1fr)" rows="1fr 1fr" areas=["name email", ". submit"])>
		<TextField label="Name" value={name} onChange={setName} (grid area="name")/>
		<TextField label="Email" value={email} onChange={setEmail} (grid area="email")/>
		<Button type="submit" (grid area="submit")>Save</Button>
	</Form>
*/}
