const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let $ = document.querySelectorAll.bind(document);
let TIME_SLEEP_ALL = 1000;

const scraper = (function() {
	const _schools = [];

	return {
		async start() {
			_schools.length = 0;

			while (
				$('button[jsaction="pane.paginationSection.nextPage"][disabled="true"]').length ===
				0
			) {
				await sleep(TIME_SLEEP_ALL);

				const _length = [...document.querySelectorAll('.section-result').values()].length;

				for (let i = 0; i < _length; i++) {
					const section = [...document.querySelectorAll('.section-result').values()][i];

					try {
						section.click();
					} catch (e) {
						console.log('Error to open section');
						await sleep(TIME_SLEEP_ALL);
						continue;
					}

					const btnBack = await this.getButtonBack();
					const header = await this.getHeader();
					const category = await this.getCategory();

					if (!this.isSchoolEnglish(category)) {
						console.log('Dont match', header, category);
						btnBack.click();
						await sleep(TIME_SLEEP_ALL);
						continue;
					}

					const school = this.buildSchool($('span.widget-pane-link'), header);
					_schools.push(school);

					btnBack.click();

					await sleep(TIME_SLEEP_ALL);
				}

				await this.goNextPage();
			}
		},

		async goNextPage() {
			await sleep(TIME_SLEEP_ALL);
			let btnNextPage = $('button[jsaction="pane.paginationSection.nextPage"]');
			btnNextPage instanceof NodeList && (btnNextPage = btnNextPage[0]);

			try {
				btnNextPage.click();
			} catch (e) {
				console.log('Error while paginate');
				this.goNextPage();
			}
		},

		getPlainText() {
			return schools.reduce(
				(str, e) =>
					(str += `${e.header}\t${e.address}\t${e.neighborhood}\t${e.city}\t${e.state}\t${e.phone}\t${e.site}\n`),
				'',
			);
		},

		isSchoolEnglish(category) {
			return /language school|english school/gi.test(category);
		},

		async getCategory() {
			let anchor = document.querySelector('button[jsaction="pane.rating.category"]');

			while (!anchor || anchor.innerText === undefined) {
				await sleep(1000);
				anchor = document.querySelector('button[jsaction="pane.rating.category"]');
			}

			return anchor.innerText;
		},

		async getHeader() {
			let header = $('h1.section-hero-header-title');
			header instanceof NodeList && (header = header[0]);

			while (!header || header.innerText === undefined) {
				await sleep(TIME_SLEEP_ALL);
				header = $('h1.section-hero-header-title');
				header instanceof NodeList && (header = header[0]);
			}

			return header.innerText;
		},

		async getButtonBack() {
			let btnBack = $('button[jsaction="pane.place.backToList"]');
			btnBack instanceof NodeList && (btnBack = btnBack[0]);

			while (!btnBack || btnBack.click === undefined) {
				await sleep(TIME_SLEEP_ALL);
				btnBack = $('button[jsaction="pane.place.backToList"]');
				btnBack instanceof NodeList && (btnBack = btnBack[0]);
			}

			return btnBack;
		},

		buildSchool(spans, header) {
			const school = {
				header,
				address: '',
				neighborhood: '',
				city: '',
				state: '',
				phone: '',
				site: '',
				addressErro: '',
			};

			spans.forEach(e => {
				let value = e.innerText;

				/**
				 * Address
				 */
				if (/.*\w{2}\,\s?\d{5}-\d{3}$/gi.test(value)) {
					value = value.replace(/Av\./g, 'Avenida').replace(/R\./g, 'Rua');

					const regex = /(.*)\s?\-\s?(.*)\,\s?(.*)\s?\-\s?(\w{2})\,.*/gi;

					if (regex.test(value)) {
						const sub = /(.*)\s?\-\s?(.*)\,\s?(.*)\s?\-\s?(\w{2})\,.*/gi.exec(value);
						school.address = sub[1].trim();
						school.neighborhood = sub[2].trim();
						school.city = sub[3].trim();
						school.state = sub[4].trim();
					} else {
						/**
						 * No match address
						 */
						school.addressErro = value;
					}
				} else if (/\(\d{2}\)\s\d+\-\d+/gi.test(value)) {
					/**
					 * Phone
					 */
					school.phone = value;
				} else if (
					/**
					 * Website url
					 */
					/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gi.test(
						value,
					)
				) {
					school.site = value;
				}
			});

			return school;
		},

		getSchools() {
			return [..._schools];
		},
	};
})();
