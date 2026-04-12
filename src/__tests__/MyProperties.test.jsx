import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import MyProperties from '../pages/Profile/MyProperties';

vi.mock('../components/PropertyCard', () => ({
    default: ({ property }) => <div data-testid="property-card">{property.title}</div>,
}));

const mockProperties = [
    { _id: 'p1', title: 'Sea View Studio', price: 1200 },
    { _id: 'p2', title: 'City Centre Flat', price: 1800 },
];

const renderComp = (props = {}) =>
    render(
        <MemoryRouter>
            <MyProperties
                properties={mockProperties}
                deleteProperty={vi.fn()}
                {...props}
            />
        </MemoryRouter>
    );

const renderEmptyComponent = () =>
    render(
        <MemoryRouter>
            <MyProperties
                properties={[]}
                deleteProperty={vi.fn()}
            />
        </MemoryRouter>
    );

const renderComponentWithData = (deleteProperty) => {

    render(
        <MemoryRouter>
            <MyProperties properties={mockProperties} deleteProperty={deleteProperty}/>
        </MemoryRouter>
    );
}

describe('MyProperties', () => {

    describe('empty state', () => {
        it('should shows "No listings yet" when properties is empty', () => {
            renderEmptyComponent();
            expect(screen.getByText('No listings yet')).toBeInTheDocument();
        });

        it('should shows "Post a property" CTA in empty state', () => {
            renderEmptyComponent();
            expect(screen.getByText('Post a property')).toBeInTheDocument();
        });

        it('should NOT render the listings grid in empty state', () => {
            renderEmptyComponent();
            expect(screen.queryByTestId('property-card')).not.toBeInTheDocument();
        });
    });

    describe('listing count label', () => {
        it('shows "2 listings" for plural', () => {
            renderComp();
            expect(screen.getByText('2 listings')).toBeInTheDocument();
        });

        it('should shows "1 listing" for singular', () => {
            render(
                <MemoryRouter>
                    <MyProperties
                        properties={[mockProperties[0]]}
                        deleteProperty={vi.fn()}
                    />
                </MemoryRouter>
            );
            expect(screen.getByText('1 listing')).toBeInTheDocument();
        });
    });

    describe('property cards', () => {
        it('should renders a card for each property', () => {
            renderComp();
            expect(screen.getAllByTestId('property-card')).toHaveLength(2);
        });

        it('should renders Edit and Delete buttons for each property', () => {
            renderComp();
            expect(screen.getAllByText('Edit')).toHaveLength(2);
            expect(screen.getAllByText('Delete')).toHaveLength(2);
        });
    });

    describe('delete modal', () => {
        it('should  modal is NOT visible on initial render', () => {
            renderComp();
            expect(screen.queryByText('Delete this property?')).not.toBeInTheDocument();
        });

        it('should opens modal when Delete button is clicked', async () => {
            renderComp();
            const deleteButtons = screen.getAllByText('Delete');
            await userEvent.click(deleteButtons[0]);
            expect(screen.getByText('Delete this property?')).toBeInTheDocument();
        });

        it('should shows warning description in modal', async () => {
            renderComp();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            expect(screen.getByText(/permanently remove/i)).toBeInTheDocument();
        });

        it('should closes modal when Cancel is clicked', async () => {
            renderComp();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Cancel'));
            expect(screen.queryByText('Delete this property?')).not.toBeInTheDocument();
        });

        it('should closes modal when backdrop is clicked', async () => {
            renderComp();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            const backdrop = screen.getByText('Delete this property?').closest('[class*="fixed"]');
            await userEvent.click(backdrop);
            expect(screen.queryByText('Delete this property?')).not.toBeInTheDocument();
        });
    });

    describe('delete confirmation', () => {
        it('should calls deleteProperty with correct id when "Yes, delete" is clicked', async () => {
            const deleteProperty = vi.fn();
            renderComponentWithData(deleteProperty);
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Yes, delete'));
            expect(deleteProperty).toHaveBeenCalledWith('p1');
            expect(deleteProperty).toHaveBeenCalledTimes(1);
        });

        it('should calls deleteProperty with the correct id when second card is deleted', async () => {
            const deleteProperty = vi.fn();
            renderComponentWithData(deleteProperty);
            await userEvent.click(screen.getAllByText('Delete')[1]);
            await userEvent.click(screen.getByText('Yes, delete'));
            expect(deleteProperty).toHaveBeenCalledWith('p2');
        });

        it('should closes modal after confirming delete', async () => {
            const deleteProperty = vi.fn();
            renderComponentWithData(deleteProperty);
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Yes, delete'));
            expect(screen.queryByText('Delete this property?')).not.toBeInTheDocument();
        });

        it('should does NOT call deleteProperty when Cancel is clicked', async () => {
            const deleteProperty = vi.fn();
            renderComponentWithData(deleteProperty);
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Cancel'));
            expect(deleteProperty).not.toHaveBeenCalled();
        });
    });
});
