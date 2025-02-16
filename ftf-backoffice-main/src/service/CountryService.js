export class CountryService {
    getCountries() {
        return fetch('/demo/data/counties.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
