import {render, screen} from "@testing-library/react"

import App from "views/App"

test("App", () => {
	render(<App />)
	expect(screen.getByText(/should?/i)).toBeInTheDocument()
})
