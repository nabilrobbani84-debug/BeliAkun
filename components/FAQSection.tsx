import React from 'react';
import { FAQS } from '@/data/mockData';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

export function FAQSection() {
  return (
    <SectionContainer id="faq" className="py-6 sm:py-8 md:py-10">
      <PageContainer className="max-w-4xl">
        <SectionHeading
          badge="JAWABAN CEPAT"
          title="Pertanyaan Sering Diajukan (FAQ)"
          subtitle="Punya pertanyaan sebelum membeli? Temukan jawabannya di bawah ini."
          align="center"
        />

        <Accordion defaultValue="faq-1" variant="cartoon">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.id} id={faq.id} title={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </PageContainer>
    </SectionContainer>
  );
}
