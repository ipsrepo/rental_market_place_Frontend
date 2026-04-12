import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../components/Modal';

describe('Modal', () => {

    it('should renders nothing when show isfalse', () => {
        const { container } = render(
            <Modal show={false} onClose={vi.fn()}>
                <p>Content</p>
            </Modal>
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('should renders children content when show is true', () => {
        render(
            <Modal show={true} onClose={vi.fn()}>
                <p>Hello Modal</p>
            </Modal>
        );
        expect(screen.getByText('Hello Modal')).toBeInTheDocument();
    });

    it('should calls onClose when clicking the backdrop', async () => {
        const onClose = vi.fn();
        render(
            <Modal show={true} onClose={onClose}>
                <p>Content</p>
            </Modal>
        );

        const backdrop = screen.getByText('Content').closest('[class*="fixed"]');
        await userEvent.click(backdrop);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onClose when clicking inside the modal card', async () => {
        const onClose = vi.fn();
        render(
            <Modal show={true} onClose={onClose}>
                <p>Content</p>
            </Modal>
        );
        await userEvent.click(screen.getByText('Content'));
        expect(onClose).not.toHaveBeenCalled();
    });
});
