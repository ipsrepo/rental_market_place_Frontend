import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import ProfilePage from '../pages/Profile/index';
import * as propertyService from '../services/property.service';
import * as favoriteService from '../services/favorite.service';
import * as localStorageUtils from '../utils/localStorage';

vi.mock('../components/PropertyCard', () => ({
    default: ({property}) => <div data-testid="property-card">{property.title}</div>,
}));

vi.mock('../pages/Profile/Profile', () => ({
    default: () => <div>Profile Tab</div>,
}));

vi.mock('../pages/Profile/SavedProperties', () => ({
    default: () => <div>Saved Tab</div>,
}));

vi.mock('../services/property.service');
vi.mock('../services/favorite.service');
vi.mock('../utils/localStorage');

const mockUser = {_id: 'user1', name: 'Sam', email: 'sam@test.com'};

const mockProperties = [
    {_id: 'p1', title: 'Sea View Studio', price: 1200},
    {_id: 'p2', title: 'City Centre Flat', price: 1800},
];

const renderPage = () =>
    render(
        <MemoryRouter>
            <ProfilePage/>
        </MemoryRouter>
    );

describe('ProfilePage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageUtils.getLocalStorage.mockReturnValue(mockUser);
        favoriteService.getUserFavorites.mockResolvedValue({status: 'success', data: []});
        propertyService.getUserProperties.mockResolvedValue({status: 'success', data: mockProperties});
        propertyService.deleteProperty.mockResolvedValue({status: 'success'});
    });

    describe('data loading', () => {
        it('should fetches user properties on mount', async () => {
            renderPage();
            await waitFor(() => {
                expect(propertyService.getUserProperties).toHaveBeenCalledWith('user1');
            });
        });

        it('should fetches saved favourites on mount', async () => {
            renderPage();
            await waitFor(() => {
                expect(favoriteService.getUserFavorites).toHaveBeenCalledWith('user1');
            });
        });

        it('should shows listings count badge on the My Properties tab', async () => {
            renderPage();
            await waitFor(() => {
                expect(screen.getByText('2')).toBeInTheDocument();
            });
        });
    });

    describe('tab navigation', () => {
        it('should switches to My Properties tab and renders cards', async () => {
            renderPage();
            await userEvent.click(screen.getByText('My Properties'));
            await waitFor(() => {
                expect(screen.getAllByTestId('property-card')).toHaveLength(2);
            });
        });
    });

    describe('delete property flow', () => {
        const goToListings = async () => {
            renderPage();
            await userEvent.click(screen.getByText('My Properties'));
            await waitFor(() => screen.getAllByTestId('property-card'));
        };

        it('should opens the delete modal when Delete is clicked', async () => {
            await goToListings();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            expect(screen.getByText('Delete this property?')).toBeInTheDocument();
        });

        it('should calls deleteProperty API with the correct property id on confirm', async () => {
            await goToListings();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Yes, delete'));
            await waitFor(() => {
                expect(propertyService.deleteProperty).toHaveBeenCalledWith('p1');
            });
        });

        it('should refetches properties after successful delete', async () => {
            await goToListings();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Yes, delete'));
            await waitFor(() => {
                expect(propertyService.getUserProperties).toHaveBeenCalledTimes(2);
            });
        });

        it('should refetches saved favourites after delete (refresh counter)', async () => {
            await goToListings();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Yes, delete'));
            await waitFor(() => {
                expect(favoriteService.getUserFavorites).toHaveBeenCalledTimes(2);
            });
        });

        it('should closes modal after confirming delete', async () => {
            await goToListings();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Yes, delete'));
            await waitFor(() => {
                expect(screen.queryByText('Delete this property?')).not.toBeInTheDocument();
            });
        });

        it('should NOT call deleteProperty when Cancel is clicked', async () => {
            await goToListings();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Cancel'));
            expect(propertyService.deleteProperty).not.toHaveBeenCalled();
        });

        it('should NOT refetch after Cancel', async () => {
            await goToListings();
            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Cancel'));
            expect(propertyService.getUserProperties).toHaveBeenCalledTimes(1);
        });

        it('should deletes the correct property when second card is targeted', async () => {
            await goToListings();
            await userEvent.click(screen.getAllByText('Delete')[1]);
            await userEvent.click(screen.getByText('Yes, delete'));
            await waitFor(() => {
                expect(propertyService.deleteProperty).toHaveBeenCalledWith('p2');
            });
        });
    });

    describe('error handling', () => {
        beforeEach(() => {
            vi.spyOn(console, 'error').mockImplementation(() => {
            });
        });

        it('should NOT crash if deleteProperty rejects', async () => {
            propertyService.deleteProperty.mockRejectedValue(new Error('Network error'));

            renderPage();

            await userEvent.click(screen.getByText('My Properties'));
            await waitFor(() => screen.getAllByTestId('property-card'));

            await userEvent.click(screen.getAllByText('Delete')[0]);
            await userEvent.click(screen.getByText('Yes, delete'));

            await waitFor(() => {
                expect(screen.getByText('My Properties')).toBeInTheDocument();
            });
        });

        it('should NOT crash if getUserProperties rejects', async () => {
            propertyService.getUserProperties.mockRejectedValue(new Error('Server error'));

            renderPage();

            await waitFor(() => {
                expect(screen.getByText('My Account')).toBeInTheDocument();
            });
        });
    });
});
