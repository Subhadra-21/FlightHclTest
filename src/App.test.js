import { render, screen, fireEvent, waitFor, waitForElement, act} from '@testing-library/react';
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  getByRole
} from '@testing-library/dom';

import { rest } from 'msw'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import FlightBooking from './App';


import {handlers} from './mocks/handlers';

const server = setupServer(handlers[1])

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


test('document should contain Flight Booking', () => {
  render(<FlightBooking />);
  const bookingElement = screen.getByText(/Flight Booking/i);
  expect(bookingElement).toBeInTheDocument();
});

test('should search flight BRL to DEL', async () => {
  server.use(...handlers)
  render(<FlightBooking />);


  fireEvent.change(screen.getByTestId(/source/i), {
    target: {value: 'BLR'},
  })

  fireEvent.change(screen.getByTestId(/destination/i), {
    target: {value: 'DEL'},
  })

  fireEvent.change(screen.getByTestId(/when/i), {
    target: {value: '2021-1-5'},
  })

  act(() => {
       fireEvent.click(screen.getByRole('button', { name: "Search Flight" }), {
           target: { value: 'true' },
       })
   });


  await waitFor(() =>{
    expect(screen.getByTestId('company')).toHaveTextContent(/Surya Airline, India/i)
    expect(screen.getByTestId('price')).toHaveTextContent(/₹ 4735/i)

  })

  fireEvent.click(screen.getByTestId('booknow'))

  fireEvent.change(screen.getByTestId(/name/i), {
    target: {value: 'ram'},
  })

  fireEvent.change(screen.getByTestId(/email/i), {
    target: {value: 'ram@gmail.com'},
  })
  await waitFor(() =>
    fireEvent.click(screen.getByTestId('confirm_booking'))
  )

  await waitFor(() =>
    expect(screen.getByTestId('result')).toHaveTextContent(/Booking Confirmed!/i)
  )
});
