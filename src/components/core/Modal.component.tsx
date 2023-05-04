import React, { memo, useEffect, useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import { v4 as uuid } from "uuid";

import { Container, Content, Header, Body, Footer } from "@/styles/components/Modal.style";
import { ReactPortal } from "@/components/core/ReactPortal.component";

interface TModalProps {
	children?: React.ReactNode;
	trigger?: React.ReactNode;

	title?: string;

	footer?: {
		showCancel?: boolean;
		cancelText?: string;
		onCancel?: () => void;

		showConfirm?: boolean;
		confirmText?: string;
		onConfirm?: () => void;
	};

	onClose?: () => void;
}

function ModalComponent(props: TModalProps) {
	const { children = null, trigger = null, footer, onClose, ...rest } = props;
	const portalId = useMemo(() => uuid(), []);

	const [isOpened, setIsOpened] = useState(false);

	function openModal() {
		setIsOpened(true);
	}

	function closeModal() {
		setIsOpened(false);
		onClose?.();
	}

	function handleContainerClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	}

	function handleConfirm() {
		footer?.onConfirm?.();
		closeModal();
	}

	function handleCancel() {
		footer?.onCancel?.();
		closeModal();
	}

	function renderTrigger() {
		return React.Children.map(trigger, (child) => {
			if (!React.isValidElement(child)) return null;

			return React.cloneElement(child as any, {
				...child.props,
				onClick: openModal,
			});
		});
	}

	function renderFooterContent() {
		const { showConfirm = true, confirmText, showCancel = true, cancelText } = footer ?? {};

		return (
			<>
				{showCancel && (
					<button type="button" onClick={handleCancel}>
						{cancelText ?? "Cancelar"}
					</button>
				)}

				{showConfirm && (
					<button type="button" onClick={handleConfirm} data-primary>
						{confirmText ?? "Confirmar"}
					</button>
				)}
			</>
		);
	}

	useEffect(() => {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && isOpened) {
				closeModal();
			}
		});

		return () => {
			document.removeEventListener("keydown", () => {});
		};
	}, []);

	return (
		<>
			{trigger && renderTrigger()}

			{isOpened && (
				<ReactPortal wrapperId={portalId}>
					<Container onClick={handleContainerClick} data-modal-container>
						<Content data-modal-container>
							<Header data-modal-header>
								<span data-title>{rest.title}</span>

								<button type="button" data-close onClick={closeModal}>
									<MdClose size={22} />
								</button>
							</Header>

							<Body data-modal-body>{children}</Body>

							<Footer data-modal-footer>{renderFooterContent()}</Footer>
						</Content>
					</Container>
				</ReactPortal>
			)}
		</>
	);
}

export const Modal = memo(ModalComponent, (prevProps, nextProps) => {
	return Object.is(prevProps, nextProps);
});
